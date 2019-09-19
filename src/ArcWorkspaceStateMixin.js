/**
 * This mixin is to reduce amount of code in `arc-request-workspace` element
 * and to separate workspace state logic.
 *
 * @mixinFunction
 * @param {Class} base
 * @return {Class}
 */
export const ArcWorkspaceStateMixin = (base) =>  class extends base {
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
  async restoreWorkspace() {
    const ac = this.activeRequests;
    if (ac && ac.length) {
      this.clearWorkspace();
    }
    this._restoring = true;
    const e = this._dispatchWorkspaceState();
    if (!e.defaultPrevented) {
      return await this._restoreModelError();
    }
    try {
      const data = await e.detail.result;
      this._restore(data);
    } catch (e) {
      this.addEmptyRequest();
    }
    this._afterRestore();
  }
  /**
   * Called when no-model error occurred during workspace restoration.
   */
  _restoreModelError() {
    this.addEmptyRequest();
    this._restoring = false;
    this._initialized = true;
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
    this._restoreMeta(state);
    this._restoreRequests(state.requests);
    this._restoreSelected(state.selected);
    this._restoreEnvironment(state.environment);
    this._restoreVariables(state.variables);
    this._restoreConfiguration(state.config);
    this._restoreWebSessionConfiguration(state.webSession);
    this._restoreAuthConfiguration(state.auth);
  }
  /**
   * A function to restore workspace metadata like version or provider information.
   * @param {Object} config Workspace definition object.
   */
  _restoreMeta(config) {
    if (config.version && typeof config.version === 'string') {
      this.version = config.version;
    }
    if (config.published && typeof config.published === 'string') {
      this.published = config.published;
    }
    if (config.description && typeof config.description === 'string') {
      this.description = config.description;
    }
    const provider = config.provider;
    if (provider && typeof provider === 'object') {
      const result = {};
      if (provider.url && typeof provider.url === 'string') {
        result.url = provider.url;
      }
      if (provider.name && typeof provider.name === 'string') {
        result.name = provider.name;
      }
      if (provider.email && typeof provider.email === 'string') {
        result.email = provider.email;
      }
      this.provider = result;
    }
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
    if (typeof config.variablesDisabled === 'boolean') {
      this.variablesDisabled = config.variablesDisabled;
    }
    if (typeof config.nativeTransport === 'boolean') {
      this.nativeTransport = config.nativeTransport;
    }
  }
  /**
   * Restores web session configuration.
   * Currently web session URL for session url input field is supported.
   *
   * @param {?Object} config Web session configuration
   */
  _restoreWebSessionConfiguration(config) {
    if (!config) {
      return;
    }
    if (config.webSessionUrl && typeof config.webSessionUrl === 'string') {
      this.webSessionUrl = config.webSessionUrl;
    }
  }
  /**
   * Restores various authorization configuration.
   *
   * @param {?Object} config Authorization configuration for workspace.
   */
  _restoreAuthConfiguration(config) {
    if (!config) {
      return;
    }
    if (config.oauth2RedirectUri && typeof config.oauth2RedirectUri === 'string') {
      this._workspaceOauth2RedirectUri = config.oauth2RedirectUri;
    }
  }
  /**
   * Forces current selection and resets restoration flags after next
   * render.
   */
  _afterRestore() {
    setTimeout(() => {
      this._restoring = false;
      this._selectedChanged(this.selected);
      this._initialized = true;
      this.requestUpdate();
    });
  }
  /**
   * Serializes workspace state to a JavaScript object.
   * @return {Object} An ArcWorkspace object
   */
  serializeWorkspace() {
    const result = {
      kind: 'ARC#Workspace',
      environment: this.environment || 'default',
      selected: this.selected || 0,
      requests: this.activeRequests || [],
      config: this.serializeConfig(),
      webSession: this.serializeWebSession(),
      auth: this.serializeAuthorization()
    };
    if (this.variables) {
      result.variables = this.variables;
    }
    const version = this.version;
    if (version) {
      result.version = version;
    }
    const published = this.published;
    if (published) {
      result.published = published;
    }
    const description = this.description;
    if (description) {
      result.description = description;
    }
    const provider = this.serializeProvider();
    if (provider) {
      result.provider = provider;
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
    if (typeof this.variablesDisabled === 'boolean') {
      result.variablesDisabled = this.variablesDisabled;
    }
    if (typeof this.nativeTransport === 'boolean') {
      result.nativeTransport = this.nativeTransport;
    }
    return result;
  }
  /**
   * Serializes workspace's web session configuration.
   * @return {Object}
   */
  serializeWebSession() {
    const result = {};
    const url = this.webSessionUrl;
    if (url && typeof url === 'string') {
      result.webSessionUrl = url;
    }
    return result;
  }
  /**
   * Serializes workspace's authorization configuration.
   * @return {Object}
   */
  serializeAuthorization() {
    const result = {};
    const url = this._workspaceOauth2RedirectUri;
    if (url && typeof url === 'string') {
      result.oauth2RedirectUri = url;
    }
    return result;
  }
  /**
   * Serializes workspace's authorization configuration.
   * @return {Object|undefined}
   */
  serializeProvider() {
    const provider = this.provider;
    if (!provider) {
      return;
    }
    const result = {};
    let hasResult = false;
    if (provider.url && typeof provider.url === 'string') {
      result.url = provider.url;
      hasResult = true;
    }
    if (provider.name && typeof provider.name === 'string') {
      result.name = provider.name;
      hasResult = true;
    }
    if (provider.email && typeof provider.email === 'string') {
      result.email = provider.email;
      hasResult = true;
    }
    return hasResult ? result : undefined;
  }
  /**
   * Runs debouncer and after timeoout it calls `__dispatchStoreWorkspace()`
   * to dispatch store event.
   * If timer is running it's going to be cancelled and new timer set.
   */
  _notifyStoreWorkspace() {
    if (this.restoring || !this._initialized || this.workspaceReadOnly) {
      return;
    }
    if (this.__storingTimeout) {
      this._clearStoreTimeout();
    }
    if (window.requestIdleCallback) {
      this.__storingTimeout = window.requestIdleCallback(() => this.__dispatchStoreWorkspace(), { timeout: 1000 });
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
    this._dispatch('workspace-state-store', {
      value
    });
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
