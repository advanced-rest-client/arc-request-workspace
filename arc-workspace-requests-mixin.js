import {dedupingMixin} from '../../@polymer/polymer/lib/utils/mixin.js';
import {afterNextRender} from '../../@polymer/polymer/lib/utils/render-status.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
/**
 * This mixin is mostly created to reduce amount of code in
 * `arc-request-workspace` element.
 *
 * The mixin specializes in placing `request-panel`s in the shadow DOM
 * wiyhout using Polymer's repeater.
 *
 * Problem with repeater is that when re-arranging items or closing an
 * item in the workspace it updates every instance of the request panel
 * to the right of the changed element and this costs a lot giving that each
 * panel has to perform a lot of computation to render the view.
 *
 * This element uses repeater to rendert he tabs, however it handles the content
 * by it's own. This mixin contains implementation for DOM manipulation for
 * request panels.
 *
 * @mixinFunction
 * @polymer
 */
export const ArcWorkspaceRequestsMixin = dedupingMixin((base) => {
  /**
   * @polymer
   * @mixinClass
   */
  class ArcWorkspaceRequestsMixin extends base {
    constructor() {
      super();
      this.__editorRequestHandler = this.__editorRequestHandler.bind(this);
      this.__editorMetaHandler = this.__editorMetaHandler.bind(this);
      this._requestStoreHandler = this._requestStoreHandler.bind(this);
      this._renderRequestDetail = this._renderRequestDetail.bind(this);
      this._renderCodeSnippets = this._renderCodeSnippets.bind(this);
      this._requestStoreFileHandler = this._requestStoreFileHandler.bind(this);
      this._requestStoreDriveHandler = this._requestStoreDriveHandler.bind(this);
    }

    get requestTemplate() {
      return html`<request-panel class="panel" bound-events="">
        <paper-icon-item class="save-icon menu-item" slot="request-context-menu">
          <iron-icon icon="arc:save"
            class="context-menu-icon"
            slot="item-icon"
            title="Save current request"></iron-icon>
          Save
        </paper-icon-item>
        <paper-icon-item class="details-icon menu-item" slot="request-context-menu">
          <iron-icon
            icon="arc:info-outline"
            class="context-menu-icon"
            slot="item-icon"
            title="Request details"></iron-icon>
          Details
        </paper-icon-item>
        <paper-icon-item class="code-icon menu-item" slot="request-context-menu">
          <iron-icon
            icon="arc:code"
            class="context-menu-icon"
            slot="item-icon"
            title="Toggles code snippets view"></iron-icon>
          Code examples
        </paper-icon-item>
        <paper-icon-item class="save-file-icon menu-item" slot="request-context-menu">
          <iron-icon icon="arc:archive" class="context-menu-icon" slot="item-icon"></iron-icon>
          Save to file
        </paper-icon-item>
        <paper-icon-item class="save-drive-icon menu-item" slot="request-context-menu">
          <iron-icon icon="arc:drive-color" class="context-menu-icon" slot="item-icon"></iron-icon>
          Save to Google Drive
        </paper-icon-item>
        <slot name="request-context-menu" slot="request-context-menu"></slot>
      </request-panel>`;
    }

    __createPanelInstance() {
      const panelTemplate = this.requestTemplate;
      const panelSource = panelTemplate.content.querySelector('request-panel');
      const panel = panelSource.cloneNode(true);
      panel.setAttribute('hidden', 'true');
      return panel;
    }
    /**
     * Sets initial properties to the request panel.
     * Note, this operation may be very resource consuming since (depending on the request)
     * there may be a lot of computations happening in the request editor.
     * @param {Element} panel Request panel
     * @param {Object} request The request object
     */
    __setPanelRequestProperties(panel, request) {
      panel.dataset.id = request._id;
      panel.editorRequest = request;
      panel.editorState = request._state;
      panel.responseMeta = request._responseMeta;
      panel.response = request._response;
      panel.responseError = request._responseError;
      panel.isErrorResponse = request._isErrorResponse;
    }
    /**
     * Passes configuration like `narrow` and `oauth2RedirectUri` to the panel
     * @param {Element} panel Request panel
     */
    __setPanelConfiguration(panel) {
      panel.narrow = this.narrow;
      panel.oauth2RedirectUri = this._oauth2RedirectUri;
      panel.ignoreContentOnGet = this.ignoreContentOnGet;
    }
    /**
     * Adds event listeners to the panel
     * @param {!Element} panel Request panel
     */
    __addPanelListeners(panel) {
      panel.addEventListener('editor-request-changed', this.__editorRequestHandler);
      panel.addEventListener('editor-state-changed', this.__editorMetaHandler);
      panel.addEventListener('response-meta-changed', this.__editorMetaHandler);
      panel.addEventListener('response-changed', this.__editorMetaHandler);
      panel.addEventListener('response-error-changed', this.__editorMetaHandler);
      panel.addEventListener('is-error-response-changed', this.__editorMetaHandler);
      panel.querySelector('.save-icon').addEventListener('click', this._requestStoreHandler);
      panel.querySelector('.details-icon').addEventListener('click', this._renderRequestDetail);
      panel.querySelector('.code-icon').addEventListener('click', this._renderCodeSnippets);
      panel.querySelector('.save-file-icon').addEventListener('click', this._requestStoreFileHandler);
      panel.querySelector('.save-drive-icon').addEventListener('click', this._requestStoreDriveHandler);
    }
    /**
     * Removes previously attached listeners from the panel
     * @param {!Element} panel Request panel
     */
    __removePanelListeners(panel) {
      panel.removeEventListener('editor-request-changed', this.__editorRequestHandler);
      panel.removeEventListener('editor-state-changed', this.__editorMetaHandler);
      panel.removeEventListener('response-meta-changed', this.__editorMetaHandler);
      panel.removeEventListener('response-changed', this.__editorMetaHandler);
      panel.removeEventListener('response-error-changed', this.__editorMetaHandler);
      panel.removeEventListener('is-error-response-changed', this.__editorMetaHandler);
      panel.querySelector('.save-icon').removeEventListener('click', this._requestStoreHandler);
      panel.querySelector('.details-icon')
      .removeEventListener('click', this._renderRequestDetail);
      panel.querySelector('.code-icon').removeEventListener('click', this._renderCodeSnippets);
      panel.querySelector('.save-file-icon').removeEventListener('click', this._requestStoreFileHandler);
      panel.querySelector('.save-drive-icon').removeEventListener('click', this._requestStoreDriveHandler);
    }
    /**
     * Finds and returns panel by id in shadow DOM.
     * @param {!String} id Request/panel id
     * @return {Element|undefined} Request panel or undefined if not found
     */
    __getPanelById(id) {
      return this.$.content.querySelector(`[data-id="${id}"]`);
    }
    /**
     * Adds new panel to the shadow DOM based on passed request.
     * The request object must contain its `_id` property when performing this
     * action even when the request is not saved to the store.
     * @param {!Object} request Any properties from ARC request + '_id'.
     */
    __addPanel(request) {
      if (!request) {
        throw new Error('Request object is required when adding request panel');
      }
      if (!request._id) {
        throw new Error('Missing request id when adding request panel');
      }
      const panel = this.__createPanelInstance(request);
      this.__setPanelConfiguration(panel);
      this.$.content.appendChild(panel);
      this.__setPanelRequestProperties(panel, request);
      afterNextRender(this, () => {
        this.__addPanelListeners(panel);
      });
    }
    /**
     * Removes panel from the shadow DOM.
     * @param {String} id Request/panel id
     */
    __removePanel(id) {
      const panel = this.__getPanelById(id);
      if (!panel) {
        console.warn(`Requested to remove panel ${id} but panel is not set`);
        return;
      }
      this.__removePanelListeners(panel);
      this.$.content.removeChild(panel);
    }
    /**
     * Handler for the `editor-request-changed` from the `request-panel`.
     * Notifies application about the state.
     * This works as a bridge between Polymer's binding system and the app
     * as the request panel is inserted into the DOM manually.
     * @param {CustomEvent} e
     */
    __editorRequestHandler(e) {
      const id = e.target.dataset.id;
      const index = this.findRequestIndex(id);
      if (index === -1) {
        console.warn(`Couldn't update request ${id}`);
        return;
      }
      let path = e.detail.path;
      if (!path) {
        path = 'editorRequest';
      }
      path = path.replace('editorRequest', `activeRequests.${index}`);
      const value = e.detail.value;
      const splicesIndex = path.indexOf('.splices');
      if (splicesIndex !== -1) {
        path = path.substr(0, splicesIndex);
        if (!this.get(path)) {
          this.set(path, []);
        }
        this.notifySplices(path, value);
        return;
      } else if (path.indexOf('.length') !== -1) {
        return;
      }
      this.set(path, value);
      this.notifyPath(path, value);
    }
    /**
     * Handler for `editor-state-changed`, `response-meta-changed`,
     * `response-changed`, `response-error-changed`, and `is-error-response-changed`
     * events to update workspace state when any of the meta data to store
     * in workspace file changes.
     * @param {CustomEvent} e
     */
    __editorMetaHandler(e) {
      const id = e.target.dataset.id;
      const index = this.findRequestIndex(id);
      if (index === -1) {
        console.warn(`Unable to notify paths for request ${id}`);
        return;
      }
      let notifyPath = `activeRequests.${index}.`;
      let {value} = e.detail;
      switch (e.type) {
        case 'editor-state-changed':
          if (e.path) {
            value = e.target.editorState;
          }
          notifyPath += '_state';
          break;
        case 'response-meta-changed':
          if (e.path) {
            value = e.target.responseMeta;
          }
          notifyPath += '_responseMeta';
          break;
        case 'response-changed':
          if (e.path) {
            value = e.target.response;
          }
          notifyPath += '_response';
          break;
        case 'response-error-changed':
          notifyPath += '_responseError';
          break;
        case 'is-error-response-changed':
          notifyPath += '_isErrorResponse';
          break;
      }
      this.set(notifyPath, value);
      this.notifyPath(notifyPath, value);
    }
    /**
     * Hiddes all visible panels in the view by adding "hidden" attribute.
     */
    __deselectPanels() {
      const nodes = this.$.content.querySelectorAll('request-panel:not([hidden])');
      for (let i = 0, len = nodes.length; i < len; i++) {
        nodes[i].setAttribute('hidden', true);
      }
    }
    /**
     * Shows a panel in the view by removing "hidden" attribute.
     * @param {String} id Panel / request id
     */
    __selectPanel(id) {
      const panel = this.__getPanelById(id);
      if (!panel) {
        console.warn('Aksed to select panel that is not in the DOM', id);
        return;
      }
      if (panel.hasAttribute('hidden')) {
        panel.removeAttribute('hidden');
      }
    }
    /**
     * Updates request object on existing panel.
     * The request object may have different id to replace the request at a position.
     * If the ID is different new ID from the request object is used.
     * @param {String} id Request / panel id
     * @param {Object} request Request properties to set.
     */
    __updatePanelRequest(id, request) {
      const panel = this.__getPanelById(id);
      if (!panel) {
        console.warn('Aksed to update request but panel not in the DOM', id);
        return;
      }
      this.__setPanelRequestProperties(panel, request);
    }
    /**
     * Removes all panels from the workspace.
     */
    __removeAllPanels() {
      const nodes = this.$.content.querySelectorAll('request-panel');
      for (let i = 0, len = nodes.length; i < len; i++) {
        this.__removePanelListeners(nodes[i]);
        this.$.content.removeChild(nodes[i]);
      }
    }
    /**
     * Updates a property on all panels
     * @param {String} prop Property name to set
     * @param {*} value Property value
     */
    __updatePanelsProperty(prop, value) {
      const nodes = this.$.content.querySelectorAll('request-panel');
      for (let i = 0, len = nodes.length; i < len; i++) {
        nodes[i][prop] = value;
      }
    }
  }
  return ArcWorkspaceRequestsMixin;
});
