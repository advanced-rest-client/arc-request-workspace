import {dedupingMixin} from '../../@polymer/polymer/lib/utils/mixin.js';
import {afterNextRender} from '../../@polymer/polymer/lib/utils/render-status.js';
/**
 * This mixin is to reduce amount of code in `arc-request-workspace` element
 * and to separate workspace state logic.
 *
 * @mixinFunction
 * @polymer
 */
export const ArcWorkspaceStateMixin = dedupingMixin((base) => {
  /**
   * @polymer
   * @mixinClass
   */
  class ArcWorkspaceStateMixin extends base {
    /**
     * Dispatches `workspace-state-read` event and returns it.
     * @return {CustomEvent}
     */
    _dispatchWorkspaceState() {
      return this._dispatch('workspace-state-read', {
        type: 'workspace-state'
      });
    }
    /**
     * Restores workspace state.
     * It dispatches `workspace-state-read` custom event to query for workspace data
     * and restores requests if they were previously stored.
     *
     * @return {Promise}
     */
    restoreWorkspace() {
      const ac = this.activeRequests;
      if (ac && ac.length) {
        this.clearWorkspace();
      }
      this._setRestoring(true);
      const e = this._dispatchWorkspaceState();
      if (!e.defaultPrevented) {
        return this._restoreModelError();
      }
      return e.detail.result
      .then((data) => this._restore(data))
      .catch((cause) => {
        console.warn(cause.message);
        this.addEmptyRequest();
      })
      .then(() => this._afterRestore());
    }
    /**
     * Called when no-model error occurred during workspace restoration.
     * @return {Promise}
     */
    _restoreModelError() {
      const m = '"workspace-state-read" event for workspace state not handled';
      console.warn(m);
      this.addEmptyRequest();
      this._setRestoring(false);
      this._setInitialized(true);
      return Promise.reject(new Error(m));
    }
    /**
     * Restores workspace state from previously stored data.
     * @param {Object} state Workspace state object
     */
    _restore(state) {
      if (!state) {
        this.addEmptyRequest();
        return;
      }
      this._restoreRequests(state.requests);
      this._restoreSelected(state.selected);
      this._restoreEnvironment(state.environment);
      this._restoreVariables(state.variables);
      this._restoreConfiguration(state.config);
    }
    /**
     * Restores requests from the state object.
     * @param {?Array<Object>} requests List of requests to restore. When not set
     * then it adds empty request.
     */
    _restoreRequests(requests) {
      if (!requests || !requests.length) {
        this.addEmptyRequest();
      } else {
        for (let i = 0, len = requests.length; i < len; i++) {
          const item = requests[i];
          if (!item._id) {
            item._id = this.$.uuid.generate();
          }
          this.appendRequest(item);
        }
      }
      this.refreshTabs();
    }
    /**
     * Restores selection from the state file.
     * Note, at the point of state restoriation selection won't be handled properly.
     * It has to be re-selected after state restoration is complete.
     * @param {?Number} selected Selected tab. When not set it selects last available
     * tab
     */
    _restoreSelected(selected) {
      if (!isNaN(selected)) {
        this.selected = Number(selected);
      } else {
        this.selected = this.activeRequests.length - 1;
      }
    }
    /**
     * Restores selected environment from the state file.
     * @param {?String} environment Environment to restore. Nothing happens if not set.
     */
    _restoreEnvironment(environment) {
      if (!environment) {
        return;
      }
      this.environment = environment;
      this._dispatch('selected-environment-changed', {
        value: environment
      }, false);
    }
    /**
     * Restores workspace variables.
     * Each item must contain the following properties:
     * - variable {String} - variable name
     * - value {String} - variable value, can contain nested variables
     * - enabled {Boolean} - By default it is true, set false to disable the variable
     * @param {?Array<Object>} variables List of variables to restore
     */
    _restoreVariables(variables) {
      if (!variables || !variables.length) {
        return;
      }
      this.variables = variables;
    }
    /**
     * Restores workspace variables.
     * @param {?Object} config Workspace configuration
     */
    _restoreConfiguration(config) {
      if (!config) {
        return;
      }
      if (typeof config.requestTimeout !== 'undefined' && !isNaN(config.requestTimeout)) {
        this.requestTimeout = Number(config.requestTimeout);
      }
      if (typeof config.validateCertificates === 'boolean') {
        this.validateCertificates = config.validateCertificates;
      }
      if (typeof config.followRedirects === 'boolean') {
        this.followRedirects = config.followRedirects;
      }
      if (config.sentMessageLimit && !isNaN(config.sentMessageLimit)) {
        this.sentMessageLimit = Number(config.sentMessageLimit);
      }
      if (typeof config.workspaceReadOnly === 'boolean') {
        this.workspaceReadOnly = config.workspaceReadOnly;
      }
    }
    /**
     * Forces current selection and resets restoration flags after next
     * render.
     */
    _afterRestore() {
      afterNextRender(this, () => {
        const selected = this.selected;
        this.selected = undefined;
        this._setRestoring(false);
        this.selected = selected;
        this._setInitialized(true);
      });
    }
    /**
     * Serializes workspace state to a JavaScript object.
     * @return {Object} An ArcWorkspace object
     */
    serializeWorkspace() {
      const result = {
        environment: this.environment || 'default',
        selected: this.selected || 0,
        requests: this.activeRequests || [],
        config: this.serializeConfig()
      };
      if (this.variables) {
        result.variables = this.variables;
      }
      return result;
    }
    /**
     * Serializes workspace configuration.
     * @return {Object}
     */
    serializeConfig() {
      const result = {};
      if (typeof this.requestTimeout === 'number') {
        result.requestTimeout = this.requestTimeout;
      }
      if (typeof this.validateCertificates === 'boolean') {
        result.validateCertificates = this.validateCertificates;
      }
      if (typeof this.followRedirects === 'boolean') {
        result.followRedirects = this.followRedirects;
      }
      if (typeof this.sentMessageLimit === 'number') {
        result.sentMessageLimit = this.sentMessageLimit;
      }
      if (typeof this.workspaceReadOnly === 'boolean') {
        result.workspaceReadOnly = this.workspaceReadOnly;
      }
      return result;
    }
    /**
     * Runs debouncer and after timeoout it calls `__dispatchStoreWorkspace()`
     * to dispatch store event.
     * If timer is running it's going to be cancelled and new timer set.
     */
    _notifyStoreWorkspace() {
      if (this.restoring || !this.initialized || this.workspaceReadOnly) {
        return;
      }
      if (this.__storingTimeout) {
        this._clearStoreTimeout();
      }
      if (window.requestIdleCallback) {
        this.__storingTimeout = window.requestIdleCallback(() => this.__dispatchStoreWorkspace(), {timeout: 1000});
      } else {
        this.__storingTimeout = window.requestAnimationFrame(() => this.__dispatchStoreWorkspace());
      }
    }
    /**
     * Clears previously set storing timer.
     */
    _clearStoreTimeout() {
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(this.__storingTimeout);
      } else {
        window.cancelAnimationFrame(this.__storingTimeout);
      }
      this.__storingTimeout = undefined;
    }
    /**
     * Dispatches `workspace-state-store` custom event to store workspace data.
     * The type of the request is `workspace-state`.
     *
     * If there's an error it is not reported back to the user.
     */
    __dispatchStoreWorkspace() {
      this.__storingTimeout = undefined;
      const value = this.serializeWorkspace();
      const e = this._dispatch('workspace-state-store', {
        value
      });
      if (!e.defaultPrevented) {
        const m = '"workspace-state-store" event for workspace state not handled';
        console.warn(m);
      }
    }
    /**
     * A handler for any of the workspace configuration options changed.
     * It notifies change to the listeners.
     */
    _workspaceConfigChanged() {
      if (this.restoring) {
        return;
      }
      this._notifyStoreWorkspace();
    }
    /**
     * Called when workspaceReadOnly property change. Always calls
     * `_workspaceReadOnlyChanged()`.
     */
    _workspaceReadOnlyChanged() {
      this.__dispatchStoreWorkspace();
    }
  }
  return ArcWorkspaceStateMixin;
});