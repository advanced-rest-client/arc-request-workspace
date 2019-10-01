import { save, infoOutline, exportVariant } from '@advanced-rest-client/arc-icons/ArcIcons.js';
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
 * @param {Class} base
 * @return {Class}
 */
export const ArcWorkspaceRequestsMixin = (base) =>  class extends base {
  get contentElement() {
    return this.shadowRoot.querySelector('#content');
  }

  constructor() {
    super();
    this.__editorRequestHandler = this.__editorRequestHandler.bind(this);
    this.__editorMetaHandler = this.__editorMetaHandler.bind(this);
    this._requestStoreHandler = this._requestStoreHandler.bind(this);
    this._renderRequestDetail = this._renderRequestDetail.bind(this);
    this._exportMenuHandler = this._exportMenuHandler.bind(this);
  }

  get requestTemplate() {
    const saveIcon = save.values[0].strings[0];
    const infoIcon = infoOutline.values[0].strings[0];
    const exportIcon = exportVariant.values[0].strings[0];
    return `
    <request-panel class="panel" boundevents>
      <anypoint-icon-item
        class="save-icon menu-item"
        title="Save current request"
        aria-label="Activate to save the request"
        tabindex="-1"
        slot="request-context-menu"
      >
        <span slot="item-icon" class="icon context-menu-icon"><svg>${saveIcon}</svg></span>
        Save
      </anypoint-icon-item>
      <anypoint-icon-item
        class="details-icon menu-item"
        title="Request details"
        aria-label="Activate to open request details dialog"
        tabindex="-1"
        slot="request-context-menu"
      >
        <span slot="item-icon" class="icon context-menu-icon"><svg>${infoIcon}</svg></span>
        Details
      </anypoint-icon-item>
      <anypoint-icon-item
        class="export-item menu-item"
        title="Opens export options dialog"
        aria-label="Activate to open export dialog"
        tabindex="-1"
        slot="request-context-menu"
      >
        <span slot="item-icon" class="icon context-menu-icon"><svg>${exportIcon}</svg></span>
        Export request
      </anypoint-icon-item>
      <slot name="request-context-menu" slot="request-context-menu"></slot>
    </request-panel>`;
  }

  __createPanelInstance() {
    // const tpl = this.requestTemplate.getTemplateElement();
    const txt = this.requestTemplate;
    const tpl = document.createElement('template');
    tpl.innerHTML = txt;
    const panelSource = tpl.content.querySelector('request-panel');
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
    panel.request = request;
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
    const properties = this.constructor.properties;
    Object.keys(properties).forEach((key) => {
      const def = properties[key];
      if (!def.panelProperty) {
        return;
      }
      if (typeof def.panelProperty === 'boolean') {
        panel[key] = this[key];
      } else {
        panel[def.panelProperty] = this[key];
      }
    });
  }
  /**
   * Adds event listeners to the panel
   * @param {!Element} panel Request panel
   */
  __addPanelListeners(panel) {
    panel.addEventListener('editorrequest', this.__editorRequestHandler);
    panel.addEventListener('editorstate', this.__editorMetaHandler);
    panel.addEventListener('responsemeta', this.__editorMetaHandler);
    panel.addEventListener('response', this.__editorMetaHandler);
    panel.addEventListener('responseerror', this.__editorMetaHandler);
    panel.addEventListener('iserrorresponse', this.__editorMetaHandler);
    panel.querySelector('.save-icon').addEventListener('click', this._requestStoreHandler);
    panel.querySelector('.details-icon').addEventListener('click', this._renderRequestDetail);
    panel.querySelector('.export-item').addEventListener('click', this._exportMenuHandler);
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
    panel.querySelector('.export-item').removeEventListener('click', this._exportMenuHandler);
  }
  /**
   * Finds and returns panel by id in shadow DOM.
   * @param {!String} id Request/panel id
   * @return {Element|undefined} Request panel or undefined if not found
   */
  __getPanelById(id) {
    return this.contentElement.querySelector(`[data-id="${id}"]`);
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
    this.contentElement.appendChild(panel);
    this.__setPanelRequestProperties(panel, request);
    setTimeout(() => {
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
      return;
    }
    this.__removePanelListeners(panel);
    this.contentElement.removeChild(panel);
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
      return;
    }
    this.activeRequests[index] = e.detail.value;
    this._notifyStoreWorkspace();
    this.requestUpdate();
    this.refreshTabs();
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
      return;
    }
    this._notifyStoreWorkspace();
    const { value } = e.detail;
    switch (e.type) {
      case 'editorstate':
        this.activeRequests[index]._state = value;
        break;
      case 'responsemeta':
        this.activeRequests[index]._responseMeta = value;
        break;
      case 'response':
        this.activeRequests[index]._response = value;
        break;
      case 'responseerror':
        this.activeRequests[index]._responseError = value;
        break;
      case 'iserrorresponse':
        this.activeRequests[index]._isErrorResponse = value;
        break;
    }
  }
  /**
   * Hiddes all visible panels in the view by adding "hidden" attribute.
   */
  __deselectPanels() {
    const nodes = this.contentElement.querySelectorAll('request-panel:not([hidden])');
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
      return;
    }
    if (panel.hasAttribute('hidden')) {
      panel.removeAttribute('hidden');
    }
    // the panel may not be yet upgraded.
    if (panel.notifyResize) {
      panel.notifyResize();
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
      return;
    }
    this.__setPanelRequestProperties(panel, request);
  }
  /**
   * Removes all panels from the workspace.
   */
  __removeAllPanels() {
    const nodes = this.contentElement.querySelectorAll('request-panel');
    for (let i = 0, len = nodes.length; i < len; i++) {
      this.__removePanelListeners(nodes[i]);
      this.contentElement.removeChild(nodes[i]);
    }
  }
  /**
   * Updates a property on all panels
   * @param {String} prop Property name to set
   * @param {*} value Property value
   */
  __updatePanelsProperty(prop, value) {
    const nodes = this.contentElement.querySelectorAll('request-panel');
    for (let i = 0, len = nodes.length; i < len; i++) {
      nodes[i][prop] = value;
    }
  }
};
