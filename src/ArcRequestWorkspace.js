import { LitElement, html } from 'lit-element';
import { ArcFileDropMixin } from '@advanced-rest-client/arc-file-drop-mixin/arc-file-drop-mixin.js';
import '@anypoint-web-components/anypoint-tabs/anypoint-tabs.js';
import '@anypoint-web-components/anypoint-tabs/anypoint-tab.js';
import { close, add } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@anypoint-web-components/anypoint-item/anypoint-icon-item.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
import '@advanced-rest-client/request-panel/request-panel.js';
import '@polymer/paper-progress/paper-progress.js';
import '@advanced-rest-client/uuid-generator/uuid-generator.js';
import '@advanced-rest-client/saved-request-editor/saved-request-editor.js';
import '@advanced-rest-client/saved-request-detail/saved-request-detail.js';
import '@advanced-rest-client/bottom-sheet/bottom-sheet.js';
import '@advanced-rest-client/web-url-input/web-url-input.js';
import '@advanced-rest-client/export-options/export-options.js';
import '@polymer/paper-toast/paper-toast.js';
import { ArcWorkspaceRequestsMixin } from './ArcWorkspaceRequestsMixin.js';
import { ArcWorkspaceDndMixin } from './ArcWorkspaceDndMixin.js';
import { ArcWorkspaceStateMixin } from './ArcWorkspaceStateMixin.js';
import '../arc-workspace-detail.js';
import '../arc-workspace-editor.js';
import styles from './WorkspaceStyles.js';
/**
 * `arc-request-workspace`
 *
 * A request workspace component for Advanced REST Client that creates a
 * list of requests.
 *
 * The element does not contain any logic responsible for storing and restoring
 * data. To use this component handle `workspace-state-store` and `workspace-state-read`
 * custom events. See source for implementation detaild.
 *
 * ## Styling
 *
 * `<arc-request-workspace>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--arc-request-workspace-tabs-backgroud-color` | | `rgba(0, 0, 0, 0.05)`
 * `--arc-request-workspace-tabs-border-color` | | `#e5e5e5`
 * `--arc-request-workspace-tabs-color` | | `rgba(0,0,0,0.87)`
 * `--arc-request-workspace-tabs-selected-background-color` | | `#fff`
 * `--arc-request-workspace-tabs-close-color` | Color of tab close button | `rgba(0, 0, 0, 0.78)`
 * `--arc-request-workspace-tabs-close-color-hover` | Color close button when hovered | `rgba(255, 255, 255, 0.54)`
 * `--arc-request-workspace-tabs-close-background-color-hover` | Bg color of tab close button when hovered | `#FF8A65`
 * `--arc-request-workspace-tabs-add-color` | Color of the add tab button | `#616161`
 * `--arc-request-workspace-tabs-add-background-color` | Background color of the add tab button | ``
 * `--arc-request-workspace-tabs-add-color-hover` | Color of the add tab button when hovered | `#616161`
 * `--arc-request-workspace-tabs-add-background-color-hover` | Background color of the add tab button when hovered | ``
 * `--arc-request-workspace-tab-dragging-background-color` | Background color of a tab when dragged | `#fff !important`
 * `--context-menu-item-color` | Color of the context menu item | ``
 * `--context-menu-item-background-color` | Background color of the context menu item | ``
 * `--context-menu-item-color-hover` | Color of the context menu item when hovered | ``
 * `--context-menu-item-background-color-hover` | Background color of the context menu item when hovered | ``
 * `--bottom-sheet-width` | Bottom sheet width | `100%`
 * `--bottom-sheet-max-width` | Bottom sheet max width | `700px`
 * `--bottom-sheet-max-height` | Bottom sheet max heigth | `calc(100vh - 68px)`
 *
 * @customElement
 * @demo demo/index.html
 * @memberof UiElements
 * @appliesMixin ArcWorkspaceRequestsMixin
 * @appliesMixin ArcWorkspaceDndMixin
 * @appliesMixin ArcWorkspaceStateMixin
 * @appliesMixin ArcFileDropMixin
 */
export class ArcRequestWorkspace extends
  ArcFileDropMixin(
    ArcWorkspaceRequestsMixin(ArcWorkspaceDndMixin(ArcWorkspaceStateMixin(LitElement)))) {

  static get styles() {
    return styles;
  }

  get workspaceEditor() {
    return this.shadowRoot.querySelector('#workspaceEditor');
  }

  get workspaceDetails() {
    return this.shadowRoot.querySelector('#workspaceDetails');
  }

  get requestDetails() {
    return this.shadowRoot.querySelector('#requestDetails');
  }

  get requestEditor() {
    return this.shadowRoot.querySelector('#requestEditor');
  }

  get uuid() {
    return this.shadowRoot.querySelector('#uuid');
  }

  get webUrlInput() {
    return this.shadowRoot.querySelector('#webUrlInput');
  }

  get selected() {
    return this._selected;
  }

  set selected(value) {
    const old = this._selected;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this._selected = value;
    this._selectedChanged(value);
    this.dispatchEvent(new CustomEvent('selected-changed', {
      detail: {
        value
      }
    }));
  }

  get restoring() {
    return this._restoring;
  }

  get initialized() {
    return this._initialized;
  }

  /*
   * `store` {Boolean} - store value in the workspoace configuration file.
   * `observer` {String} - function name to call when value changed
   * `panelProperty` {String|Boolean} The value is passed to active and new panels.
   * If the value is string it is a name of the property to use on the panel when
   * setting changed value.
   */
  static get properties() {
    return {
      /**
       * Index of selected request panel
       */
      selected: { type: Number },
      /**
       * List of currently loaded requests
       * @type {Array<Object>}
       */
      activeRequests: { type: Array },
      /**
       * Currently selected workspace.
       * When this value change it triggers workspace state change.
       */
      environment: { type: String, store: true },
      /**
       * Workspace variables.
       * It is added to each request sent from this worksapce so the request logic
       * can apply additional variables.
       * @type {Array<Object>}
       */
      variables: { type: Array, store: true },
      /**
       * Each request sent from this workspace timeout.
       * @type {Number}
       */
      requestTimeout: { type: Number, store: true },
      /**
       * Added to all requests sent from this workspace.
       * Instructs the transport library to validate SSL certificates.
       * @type {Boolean}
       */
      validateCertificates: { type: Boolean, store: true },
      /**
       * Added to all requests sent from this workspace.
       * Instructs the transport library how to manage redirects.
       * @type {Boolean}
       */
      followRedirects: { type: Boolean, store: true },
      /**
       * Added to all requests sent from this workspace.
       * Instructs the transport library to limit the size of the source message
       * sent to the server returned by the library. It is used to limit
       * memory use when reading the response.
       * @type {Number}
       */
      sentMessageLimit: { type: Number, store: true },
      /**
       * When set writing to the workspace state file is disabled.
       */
      workspaceReadOnly: { type: Number, observer: '_workspaceReadOnlyChanged' },
      /**
       * When set requests made from this workspace won't evaluate variables.
       * @type {Boolean}
       */
      variablesDisabled: { type: Boolean, store: true },
      /**
       * When set requests made from this workspace will be executed using
       * Node's native HTTP(S) transport.
       * Note, this option is only available for Electron app.
       * @type {Boolean}
       */
      nativeTransport: { type: Boolean, store: true },
      /**
       * If set then workspace restoration process is in progress.
       */
      _restoring: { type: Boolean, reflect: true, attribute: 'restoring' },
      /**
       * The component automatically ask to restore workspace when connected
       * to the DOM. This ensures to prohibit auto restore request.
       */
      noAutoRestore: { type: Boolean },
      /**
       * When set the request meta data editor is opened.
       */
      editorOpened: { type: Boolean },
      /**
       * When set the request meta data viewer is opened.
       */
      detailsOpened: { type: Boolean },
      /**
       * When set the workspace meta data viewer is opened.
       */
      workspaceDetailsOpened: { type: Boolean },
      /**
       * When set the workspace meta data editor is opened.
       */
      workspaceEditorOpened: { type: Boolean },
      /**
       * Set when workspace state has been read.
       */
      _initialized: { type: Boolean },
      /**
       * When set the elements that require project data won't automatically
       * ask for project data.
       */
      noAutoProjects: { type: Boolean },
      /**
       * If set it renders the view in the narrow layout.
       */
      narrow: { type: Boolean, panelProperty: true },
      /**
       * Redirect URL for the OAuth2 authorization.
       * If can be also set by dispatching `oauth2-redirect-url-changed`
       * with `value` property on the `detail` object.
       */
      oauth2RedirectUri: { type: String, observer: '_setOauthRedirect' },
      /**
       * Variable set from workspace configuration. The same as `oauth2RedirectUri`
       * but it takes precedence over it.
       * @type {String}
       */
      _workspaceOauth2RedirectUri: {
        type: String,
        store: true,
        storeKey: 'oauth2RedirectUri',
        observer: '_setOauthRedirect'
      },
      /**
       * Computed final value of oauth2 redirect URI passed to the request panel.
       * @type {String}
       */
      _oauth2RedirectUri: {
        type: String,
        observer: '_oauthUriChanged',
        panelProperty: 'oauth2RedirectUri'
      },
      /**
       * When set it will ignore all `content-*` headers when the request method
       * is either `GET` or `HEAD`. This is passed to the request panel.
       * When not set or `false` it renders warning dialog.
       * @type {Boolean}
       */
      ignoreContentOnGet: { type: Boolean, panelProperty: true },
      /**
       * An URL to be present in the session URL input when opened.
       * The input can be opened by calling `openWebUrlInput()`
       */
      webSessionUrl: { type: String, store: true },
      /**
       * Workspace file version.
       * Has no meaning for the request processing but this information is rendered
       * in request workspace details dialog.
       * @type {String}
       */
      version: { type: String, store: true },
      /**
       * Workspace publication date as an ISO date string.
       * Has no meaning for the request processing but this information is rendered
       * in request workspace details dialog.
       * @type {String}
       */
      published: { type: String, store: true },
      /**
       * Workspace description.
       */
      description: { type: String, store: true },
      /**
       * Workspace publisher information.
       *
       * Supported properties:
       * - url
       * - name
       * - email
       *
       * Has no meaning for the request processing but this information is rendered
       * in request workspace details dialog.
       * @type {Object}
       */
      provider: { type: Object, store: true },
      /**
       * Enables compatibility with Anypoint platform
       */
      compatibility: { type: Boolean, panelProperty: true },
      /**
       * Enables material's outlined theme for inputs.
       */
      outlined: { type: Boolean, panelProperty: true },
      /**
       * When set is enables encryption options.
       * Currently only in the export panel.
       */
      withEncrypt: { type: Boolean },
      /**
       * Indicates that the export options panel is currently rendered.
       */
      _exportOptionsOpened: { type: Boolean },
      _exportOptions: { type: Object }
    };
  }

  constructor() {
    super();
    this._envChangedHandler = this._envChangedHandler.bind(this);
    this._requestChangeHandler = this._requestChangeHandler.bind(this);
    this._requestDeleteHandler = this._requestDeleteHandler.bind(this);
    this._appendRequestHandler = this._appendRequestHandler.bind(this);
    this._sendRequestHandler = this._sendRequestHandler.bind(this);
    this._openProjectHandler = this._openProjectHandler.bind(this);
    this.activeRequests = [];
    this._exportOptions = {
      file: this._generateExportFileName(),
      provider: 'file',
      providerOptions: {
        parents: ['My Drive']
      }
    };
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    window.addEventListener('selected-environment-changed', this._envChangedHandler);
    window.addEventListener('request-object-changed', this._requestChangeHandler);
    window.addEventListener('request-object-deleted', this._requestDeleteHandler);
    window.addEventListener('request-workspace-append', this._appendRequestHandler);
    window.addEventListener('workspace-open-project-requests', this._openProjectHandler);
    this.addEventListener('api-request', this._sendRequestHandler);
    if (!this.noAutoRestore && !this.activeRequests.length) {
      setTimeout(() => this.restoreWorkspace());
    }
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    window.removeEventListener('selected-environment-changed', this._envChangedHandler);
    window.removeEventListener('request-object-changed', this._requestChangeHandler);
    window.removeEventListener('request-object-deleted', this._requestDeleteHandler);
    window.removeEventListener('request-workspace-append', this._appendRequestHandler);
    window.removeEventListener('workspace-open-project-requests', this._openProjectHandler);
    this.removeEventListener('api-request', this._sendRequestHandler);
  }

  updated(changedProperties) {
    let update = false;
    const properties = ArcRequestWorkspace.properties;
    changedProperties.forEach((old, key) => {
      const def = properties[key];
      if (!def) {
        return;
      }
      if (def.store) {
        update = true;
      }
      if (def.panelProperty) {
        this.__updatePanelsProperty(def.storeKey || key, this[key]);
      }
      if (def.observer) {
        try {
          this[def.observer](this[key], old);
        } catch (e) {
          // ..
        }
      }
    });
    if (update) {
      this._workspaceConfigChanged();
    }
  }

  /**
   * Dispatches bubbling and composed custom event.
   * By default the event is cancelable until `cancelable` property is set to false.
   * @param {String} type Event type
   * @param {?any} detail A detail to set
   * @param {?Boolean} cancelable When false the event is not cancelable.
   * @return {CustomEvent}
   */
  _dispatch(type, detail, cancelable) {
    if (typeof cancelable !== 'boolean') {
      cancelable = true;
    }
    const e = new CustomEvent(type, {
      bubbles: true,
      composed: true,
      cancelable,
      detail
    });
    this.dispatchEvent(e);
    return e;
  }
  /**
   * Finds first position where the request is empty.
   * @return {Number} Index of empty request or `-1`.
   */
  _getEmptyPosition() {
    const ar = this.activeRequests;
    let result = -1;
    if (!ar || !ar.length) {
      return result;
    }
    for (let i = 0, len = ar.length; i < len; i++) {
      const item = ar[i];
      if ((!item.url || item.url === 'http://') && !item.headers && !item.payload) {
        result = i;
        break;
      }
    }
    return result;
  }
  /**
   * Computes name for a tab.
   * @param {?String} name Request name
   * @param {?String} url Request URL
   * @return {String} Tab name which is (in order) name, url, or "New request".
   */
  _computeTabName(name, url) {
    if (name) {
      return name;
    }
    if (url) {
      return url;
    }
    return 'New request';
  }
  /**
   * Appends request to the list of `activeRequests` and selects it.
   *
   * Note, the request data are passed after rext render frame so returned
   * index referes to empty object at the time when it's returned.
   *
   * @param {Object} request ArcRequest object.
   * @param {?Object} opts Add request options:
   * - skipPositionCheck {Boolean} - Won't check for empty panel before
   * appending it to the list
   * - noAutoSelect {Boolean} - Won't attempt to select added request
   * @return {Number} Index of newly created request.
   */
  appendRequest(request, opts) {
    opts = opts || {};
    let index = opts.skipPositionCheck ? -1 : this._getEmptyPosition();
    let lastAddedId;
    if (index !== -1) {
      if (!request._id) {
        request._id = this.activeRequests[index]._id;
      }
      const panelId = this.activeRequests[index]._id;
      this.activeRequests[index] = request;
      this.refreshTabs(request);
      this.__updatePanelRequest(panelId, request);
      lastAddedId = request._id;
    } else {
      if (!request._id) {
        request._id = this.uuid.generate();
      }
      const length = this.activeRequests.push(request);
      this.__addPanel(request);
      index = length - 1;
      lastAddedId = request._id;
    }
    if (!opts.noAutoSelect) {
      if (index !== this.selected) {
        this.selected = index;
      } else {
        this.__selectPanel(lastAddedId);
      }
    }
    this._notifyStoreWorkspace();
    this.requestUpdate();
    return index;
  }
  /**
   * Adds a request at specific position moving the request at the position to the right.
   * If the position is out of `activeRequests` bounds
   * @param {Number} index The position of the tab where to put the request
   * @param {Object} request Request object to put.
   * @param {?Object} opts Add request options:
   * - noAutoSelect {Boolean} - Won't attempt to select added request
   */
  appendRequestAt(index, request, opts) {
    opts = opts || {};
    if (!request._id) {
      request._id = this.uuid.generate();
    }
    const items = this.activeRequests;
    if (index >= items.length) {
      items.push(request);
    } else {
      items.splice(index, 0, request);
    }
    this.activeRequests = items;
    this.__addPanel(request);
    if (!opts.noAutoSelect) {
      this.selected = index;
    }
    this.requestUpdate();
  }
  /**
   * Adds an empty request to the workspace.
   */
  addEmptyRequest() {
    this.appendRequest({
      url: 'http://',
      method: 'GET'
    });
  }
  /**
   * Updates request on a specific position.
   * @param {Object} request ArcRequest object
   * @param {Number} index Request index
   */
  updateRequestObject(request, index) {
    const ar = this.activeRequests;
    if (!ar || !ar[index]) {
      return;
    }
    const oldId = ar[index]._id;
    if (!request._id) {
      request._id = this.uuid.generate();
    }
    this.activeRequests[index] = request;
    this.__updatePanelRequest(oldId, request);
  }
  /**
   * Handler for click event on the request close button.
   * @param {ClickEvent} e
   */
  _closeRequest(e) {
    e.preventDefault();
    e.stopPropagation();
    const index = Number(e.currentTarget.dataset.index);
    if (isNaN(index)) {
      return;
    }
    this.removeRequest(index);
  }
  /**
   * Removes request for given index
   * @param {Number} index Request index in the `activeRequests` liost.
   * @param {?Boolean} removeOnly When true it only removes the panel but
   * will not check for the selection state and if empty panel is needed
   */
  removeRequest(index, removeOnly) {
    const items = this.activeRequests;
    if (!items || !items.length) {
      return;
    }
    const removed = items.splice(index, 1);
    this.requestUpdate();
    this.__removePanel(removed[0]._id);
    if (removeOnly) {
      return;
    }
    if (index === this.selected) {
      index--;
      if (index < 0) {
        index = 0;
      }
      if (index === 0) {
        this.selected = undefined;
      }
      this.selected = index;
    } else if (this.selected > index) {
      this.selected--;
    }
    if (!items.length) {
      setTimeout(() => {
        this.addEmptyRequest();
      });
    }
  }
  /**
   * Update tabs selection.
   */
  refreshTabs() {
    this.shadowRoot.querySelector('anypoint-tabs').notifyResize();
  }
  /**
   * Notifies workspace state change when selected request changes.
   * @param {Number} selected item
   */
  _selectedChanged(selected) {
    if (this.restoring) {
      return;
    }
    const request = this.activeRequests[selected];
    if (!request) {
      return;
    }
    this.__deselectPanels();
    this.__selectPanel(request._id);
    this._notifyStoreWorkspace();
  }
  /**
   * Updates environment value in the state file when it's value change.
   *
   * @param {CustomEvent} e
   */
  _envChangedHandler(e) {
    const path = e.path || e.composedPath();
    if (path[0] === this || this.restoring) {
      return;
    }
    this.environment = e.detail.value;
  }
  /**
   * Finds requests index in the list of active requests.
   *
   * @param {String} requestId Saved request ID
   * @param {?String} tmpId An ID created by this component to identify
   * not saved request.
   * @return {Number} Request index or -1 if not found.
   */
  findRequestIndex(requestId, tmpId) {
    if (!requestId && !tmpId) {
      return -1;
    }
    return this.activeRequests.findIndex((item) =>
      item._id === requestId || tmpId && item._tempId === tmpId);
  }
  /**
   * Finds a request associated with the menu item which is the target of the
   * event. The menu item has to have `data-id` property set to request ID.
   * @param {ClickEvent} e
   * @return {Object|undefined} Request object or undefined if not found.
   */
  _getMenuRequest(e) {
    const panelId = e.target.parentElement.dataset.id;
    if (!panelId && panelId !== 0) {
      return;
    }
    const index = this.findRequestIndex(panelId);
    return this.activeRequests[index];
  }
  /**
   * Opens save editor
   *
   * @param {CustomEvent} e
   */
  _requestStoreHandler(e) {
    const request = this._getMenuRequest(e);
    if (!request) {
      return;
    }
    this._openSaveDialog(request);
  }
  /**
   * Opens the request details view
   *
   * @param {CustomEvent} e
   */
  _renderRequestDetail(e) {
    const request = this._getMenuRequest(e);
    if (!request) {
      return;
    }
    this.requestDetails.request = request;
    this.detailsOpened = true;
  }
  /**
   * Open export dialog and sets `_exportItem` on the element.
   * @param {ClickEvent} e
   */
  _exportMenuHandler(e) {
    const request = this._getMenuRequest(e);
    if (!request) {
      return;
    }
    this._exportOptionsOpened = true;
    this._exportItem = request;
  }

  _cancelExportOptions() {
    this._exportOptionsOpened = false;
    this._exportItem = undefined;
  }

  async _acceptExportOptions(e) {
    const request = this._exportItem;
    if (!request) {
      return;
    }
    this._exportItem = undefined;
    this._exportOptionsOpened = false;
    const detail = e.detail;
    return await this._exportRequest(request, detail);
  }
  /**
   * Calls `_dispatchExportData()` with parameters.
   *
   * @param {Object} request A request to export
   * @param {String} detail Export configuration
   * @return {Promise}
   */
  async _exportRequest(request, detail) {
    detail.options.kind = 'ARC#SavedExport';
    const e = this._dispatchExportData(request, detail);
    if (!e.defaultPrevented) {
      return;
    }
    try {
      await e.detail.result;
      if (detail.options.provider === 'drive') {
        // TODO: Render link to the folder
        const toast = this.shadowRoot.querySelector('#driveSaved');
        toast.opened = true;
      }
      this._exportItem = undefined;
    } catch (e) {
      const node = this.shadowRoot.querySelector('#errorToast');
      node.text = e.message;
      node.opened = true;
    }
  }
  /**
   * Dispatches `arc-data-export` event and returns it.
   * @param {Object} request The request to export.
   * @param {Object} opts
   * @return {CustomEvent}
   */
  _dispatchExportData(request, opts) {
    const data = {
      saved: [request]
    };
    return this._dispatch('arc-data-export', {
      options: opts.options,
      providerOptions: opts.providerOptions,
      data
    });
  }
  /**
   * Handler for non cancelable `request-object-changed` custom event.
   * Updates request object if it's one of currently opened objects.
   * @param {CustomEvent} e
   */
  _requestChangeHandler(e) {
    if (e.cancelable) {
      return;
    }
    const index = this.findRequestIndex(e.detail.request._id,
      e.detail.request._tempId);
    if (index === -1) {
      return;
    }
    this.activeRequests[index] = e.detail.request;
    this.requestUpdate();
    this._notifyStoreWorkspace();
  }
  /**
   * A handler for `request-object-deleted` custom event.
   * Checks if deleted request is one of curerently rendered. If found it
   * removes information related to "saved" request.
   *
   * @param {CustomEvent} e
   */
  _requestDeleteHandler(e) {
    if (e.cancelable) {
      return;
    }
    const index = this.findRequestIndex(e.detail.id);
    if (index === -1) {
      return;
    }
    const request = this.activeRequests[index];
    delete request.name;
    delete request.type;
    delete request.driveId;
    delete request.projects;
    delete request._id;
    delete request._rev;
    delete request.created;
    delete request.updated;
    this.activeRequests[index] = request;
    this.activeRequests[index].name = '';
    this.requestUpdate();
    this._notifyStoreWorkspace();
  }
  /**
   * Adds request(s) by id.
   * @param {String} type A request type. `history` or `saved`
   * @param {String|Array<String>} id Request id or list of ids
   * @return {Promise}
   */
  async addRequestById(type, id) {
    const ev = this._dispatch('request-object-read', {
      id,
      type,
      opts: {
        restorePayload: true
      }
    });
    if (!ev.defaultPrevented) {
      throw new Error('Request model not found');
    }
    this._restoring = true;
    let result = await ev.detail.result;
    if (!result) {
      this._restoring = false;
      throw new Error('Request not found');
    }
    if (!(result instanceof Array)) {
      result = [result];
    }
    let lastAddedPosition;
    result.forEach((item) => {
      const index = this.findRequestIndex(item._id);
      if (index === -1) {
        lastAddedPosition = this.appendRequest(item, {
          noAutoSelect: true
        });
      } else {
        lastAddedPosition = index;
        this.updateRequestObject(item, index);
      }
    });
    this._restoring = (false);
    this.selected = lastAddedPosition;
  }
  /**
   * Replaces current workspace with a request(s) passed in the argument.
   * @param {String} type A request type. `history` or `saved`
   * @param {String|Array<String>} id Request id or list of ids
   * @return {Promise}
   */
  replaceByRequestId(type, id) {
    this.clearWorkspace(true);
    return this.addRequestById(type, id);
  }
  /**
   * Clears the workspace. Adds new empty request when ready.
   *
   * @param {Boolean} ignoreAdd If set it won't add empty panel.
   */
  clearWorkspace(ignoreAdd) {
    this.__removeAllPanels();
    this.activeRequests = [];
    this.selected = undefined;
    if (ignoreAdd) {
      return;
    }
    setTimeout(() => {
      this.addEmptyRequest();
    });
  }
  /**
   * Adds requests by a project.
   * @param {String|Object} project Project id or project object
   * @param {?Number} index Position where to start adding requests from the project.
   * @return {Promise}
   */
  async appendByProject(project, index) {
    if (!project) {
      throw new Error('Expecting argument.');
    }
    let e;
    const options = {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        opts: {
          restorePayload: true
        }
      }
    };
    if (typeof project === 'string') {
      options.detail.id = project;
      e = new CustomEvent('request-project-list', options);
    } else if (project.requests) {
      options.detail.id = project.requests;
      options.detail.type = 'saved';
      e = new CustomEvent('request-object-read', options);
    } else if (project._id) {
      options.detail.id = project._id;
      e = new CustomEvent('request-project-list', options);
    }
    if (!e) {
      throw new Error('Unknown configuration');
    }
    this.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw new Error('Request model not found');
    }
    this._restoring = (true);
    const data = await e.detail.result;
    let lastIndex;
    let hasIndex = typeof index === 'number';
    if (hasIndex && index >= this.activeRequests.length) {
      hasIndex = false;
    }
    const opts = {
      skipPositionCheck: true,
      noAutoSelect: true
    };
    for (let i = 0, len = data.length; i < len; i++) {
      if (hasIndex) {
        lastIndex = index + i;
        this.appendRequestAt(lastIndex, data[i], opts);
      } else {
        lastIndex = this.appendRequest(data[i], opts);
      }
    }
    this._restoring = (false);
    this.selected = lastIndex;
    this.refreshTabs();
  }
  /**
   * Replace current workspace data by a project.
   * @param {String|Object} project Project id or project object
   * @return {Promise}
   */
  replaceByProject(project) {
    this.clearWorkspace(true);
    return this.appendByProject(project);
  }
  /**
   * Handler for `workspace-open-project-requests` dispatched by projects
   * menu.
   * @param {CustomEvent} e Detail object contains `project` which can be
   * string as project ID or project object and `replace` which determines
   * if the workspace state should be replaced.
   */
  _openProjectHandler(e) {
    if (e.defaultPrevented) {
      return;
    }
    e.preventDefault();
    const { project, replace } = e.detail;
    if (replace) {
      e.detail.result = this.replaceByProject(project);
    } else {
      e.detail.result = this.appendByProject(project);
    }
  }
  /**
   * Replaces current workspace with the request data passed as an argument.
   * @param {Array<Object>} requests List of ArcRequest objects to use.
   */
  replaceByRequestsData(requests) {
    this.clearWorkspace(true);
    this._restoring = (true);
    if (requests && requests.length) {
      let pos;
      for (let i = 0, len = requests.length; i < len; i++) {
        if (!requests[i]._id) {
          requests[i]._id = this.uuid.generate();
        }
        pos = this.appendRequest(requests[i], {
          skipPositionCheck: true,
          noAutoSelect: true
        });
      }
      this._restoring = (false);
      this.selected = pos;
    } else {
      this._restoring = (false);
      this.addEmptyRequest();
    }
    this.refreshTabs();
  }
  /**
   * Informs components to store request data.
   * @param {?Object} opts Optional. If `source` property is set it
   * dispatches `save-request` custom event immidietly. Otherwise dialog
   * is shown.
   */
  saveOpened(opts) {
    const request = this.activeRequests[this.selected];
    if (!request) {
      return;
    }
    opts = opts || {};
    if (request.type && request.type !== 'history' && opts.source === 'shortcut') {
      const options = {
        isDrive: !!request.driveId
      };
      this.dispatchEvent(new CustomEvent('save-request', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          request,
          options
        }
      }));
      return;
    }
    this._openSaveDialog(request);
  }
  /**
   * Called to request resize on opened `bottom-sheet` element.
   * @param {CustomEvent} e
   */
  _resizeSheetContent(e) {
    const panel = e.target.querySelector(
        'saved-request-editor,saved-request-detail,http-code-snippets,arc-workspace-detail');
    if (panel && panel.notifyResize) {
      panel.notifyResize();
    }
  }
  /**
   * Render saved dialog (bottom-sheet)
   * @param {Object} request Request to set on the editor
   */
  _openSaveDialog(request) {
    if (!request._tempId) {
      request._tempId = this.uuid.generate();
    }
    this.requestEditor.request = request;
    this.editorOpened = true;
  }
  /**
   * Cancels request edit dialog and closes the dialog.
   * @param {CustomEvent} e
   */
  _cancelRequestEdit(e) {
    e.stopPropagation();
    this.editorOpened = false;
    this.requestEditor.request = undefined;
  }
  /**
   * Closes request edit dialog when save event is dispatched.
   * @param {CustomEvent} e
   */
  _saveRequestEdit() {
    this.editorOpened = false;
    this.requestEditor.request = undefined;
  }
  /**
   * Handler for the delete action from the details popup.
   * @param {CustomEvent} e
   */
  _deleteRequestDetails(e) {
    e.stopPropagation();
    this.detailsOpened = false;
    const request = e.target.request;
    e.target.request = undefined;
    if (!request._rev || !request._id) {
      return;
    }
    this._dispatch('request-object-deleted', {
      type: request.type,
      id: request._id
    });
  }

  _editRequestDetails(e) {
    e.stopPropagation();
    const request = this.requestDetails.request;
    this.detailsOpened = false;
    this.requestEditor.request = request;
    this.editorOpened = true;
  }
  /**
   * Returns a reference to currently selected panel.
   * @return {HTMLElement}
   */
  getActivePanel() {
    const request = this.activeRequests[this.selected];
    if (!request) {
      return;
    }
    const panel = this.__getPanelById(request._id);
    if (!panel) {
      return;
    }
    return panel;
  }
  /**
   * Runs cureently active tab.
   */
  sendCurrent() {
    const panel = this.getActivePanel();
    panel.send();
  }
  /**
   * Aborts currenlt selected panel
   */
  abortCurrent() {
    const panel = this.getActivePanel();
    panel.abort();
  }
  /**
   * Aborts currenlt selected panel
   */
  clearCurrent() {
    const panel = this.getActivePanel();
    panel.clear();
  }
  /**
   * Aborts all running requests
   */
  abortAll() {
    const nodes = this.shadowRoot.querySelectorAll('request-panel');
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].loading) {
        nodes[i].abort();
      }
    }
  }
  /**
   * Appends Project/Saved/History export data directly to workspace.
   * @param {Object} detail Arc import object with normalized import structure.
   */
  appendImportRequests(detail) {
    let requests;
    switch (detail.kind) {
      case 'ARC#ProjectExport':
      case 'ARC#SavedExport':
        requests = detail.requests;
        break;
      case 'ARC#HistoryExport':
        requests = detail.history;
        break;
    }
    if (!requests) {
      return;
    }
    let index;
    requests.forEach((item) => {
      index = this.appendRequest(item, {
        noAutoSelect: true
      });
    });
    this.selected = index;
  }

  /**
   * Handler for `request-workspace-append` custom event. Appends request
   * to the worspace.
   * @param {CustomEvent} e A `request` property on detail object is expected.
   */
  _appendRequestHandler(e) {
    switch (e.detail.kind) {
      case 'ARC#ProjectExport':
      case 'ARC#SavedExport':
      case 'ARC#HistoryExport':
        this.appendImportRequests(e.detail);
        break;
      case 'ARC#Request':
        this.appendRequest(e.detail.request);
        break;
      default:
    }
  }
  /**
   * Adds workspace configuration to the request object.
   * This overrides application configuration.
   * The function won't set configuration property when it is already set on the request.
   * @param {CustomEvent} e `api-request` event dispatched from any panel.
   */
  _sendRequestHandler(e) {
    const config = {};
    const rConfig = e.detail.config || {};
    if (typeof rConfig.timeout !== 'number' && typeof this.requestTimeout === 'number') {
      config.timeout = this.requestTimeout;
    }
    if (typeof rConfig.validateCertificates !== 'boolean' &&
      typeof this.validateCertificates === 'boolean') {
      config.validateCertificates = this.validateCertificates;
    }
    if (typeof rConfig.followRedirects !== 'boolean' &&
      typeof this.followRedirects === 'boolean') {
      config.followRedirects = this.followRedirects;
    }
    if (typeof rConfig.sentMessageLimit !== 'number' &&
      typeof this.sentMessageLimit === 'number') {
      config.sentMessageLimit = this.sentMessageLimit;
    }
    if (typeof rConfig.variablesDisabled !== 'boolean' &&
      typeof this.variablesDisabled === 'boolean') {
      config.variablesDisabled = this.variablesDisabled;
    }
    if (typeof rConfig.nativeTransport !== 'boolean' &&
      typeof this.nativeTransport === 'boolean') {
      config.nativeTransport = this.nativeTransport;
    }
    const rVars = rConfig.variables;
    const hasVars = !!(rVars && rVars instanceof Array && rVars.length);
    const ownVars = this.variables;
    if (!hasVars && ownVars && ownVars.length) {
      config.variables = ownVars.map((item) => Object.assign({}, item));
    }
    if (Object.keys(config).length === 0) {
      return;
    }
    if (!e.detail.config) {
      e.detail.config = {};
    }
    e.detail.config = config;
  }
  /**
   * Duplicates tab values at a position
   * @param {Number} index Selected tab
   */
  duplicateTab(index) {
    const items = this.activeRequests || [];
    const current = items[index];
    if (!current) {
      return;
    }
    const copy = Object.assign({}, current);
    this._clearRequestMeta(copy, true);
    delete copy.name;
    delete copy.driveId;
    delete copy.projects;
    delete copy.type;
    delete copy.legacyProject;
    this.appendRequest(copy, {
      skipPositionCheck: true
    });
  }
  /**
   * Removes all stored properties in a request object to prepare ArcRequest object.
   * @param {Object} request
   * @param {Boolean} includeIds
   * @return {Object}
   */
  _clearRequestMeta(request, includeIds) {
    Object.keys(request).forEach((key) => {
      if (key[0] === '_') {
        if (!includeIds && (key === '_id' || key === '_rev')) {
          return;
        }
        delete request[key];
      }
    });
    return request;
  }
  /**
   * Closes currently selected tab.
   */
  closeActiveTab() {
    const i = this.selected;
    this.removeRequest(i);
  }

  _oauthUriChanged(value) {
    this.__updatePanelsProperty('oauth2RedirectUri', value);
  }

  _setOauthRedirect() {
    const { oauth2RedirectUri, _workspaceOauth2RedirectUri } = this;
    this._oauth2RedirectUri = _workspaceOauth2RedirectUri || oauth2RedirectUri;
    this.__updatePanelsProperty('oauth2RedirectUri', this._oauth2RedirectUri);
  }
  /**
   * Opens the input for opening web app to start a web session.
   *
   * The input, when accepted, dispatches `open-web-url` custom event which is
   * not handled by this element. The application should handle this event
   * and open browser window or other mean to start a web session.
   */
  openWebUrlInput() {
    this.webUrlInput.opened = true;
  }
  /**
   * Opens workspace metadata viewer.
   */
  openWorkspaceDetails() {
    [
      'published', 'version', 'provider', 'description'
    ].forEach((prop) => {
      this.workspaceDetails[prop] = this[prop];
    });
    this.workspaceDetailsOpened = true;
  }


  /**
   * Opens workspace metadata editor.
   */
  openWorkspaceEditor() {
    [
      'published', 'version', 'description'
    ].forEach((prop) => {
      this.workspaceEditor[prop] = this[prop] || '';
    });
    let provider;
    if (this.provider) {
      provider = Object.assign({}, this.provider);
    } else {
      provider = {};
    }
    this.workspaceEditor.provider = provider;
    this.workspaceEditorOpened = true;
  }
  /**
   * Closes workspace metadata edit dialog due to user cancelation.
   */
  _cancelWorkspaceEdit() {
    this.workspaceEditorOpened = false;
  }
  /**
   * Updates properties from save workspace event.
   * @param {CustomEvent} e
   */
  _updateWorkspaceMeta(e) {
    const { version, published, description, provider } = e.detail;
    this.version = version;
    this.published = published;
    this.description = description;
    this.provider = provider;
    this.workspaceEditorOpened = false;
  }

  /**
   * Generates file name for the export options panel.
   * @return {String}
   */
  _generateExportFileName() {
    const d = new Date();
    const year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
    return `arc-request-${year}-${month}-${day}.arc`;
  }

  _sessionUrlChanged(e) {
    this.webSessionUrl = e.detail.value;
  }

  _tabsHandler(e) {
    this.selected = e.detail.value;
  }

  _bottomSheetClosed(e) {
    const prop = e.target.dataset.property;
    this[prop] = false;
  }

  _tabsTemplate() {
    const {
      selected,
      compatibility,
      draggableEnabled
    } = this;
    const items = this.activeRequests || [];
    return html`
    <anypoint-tabs
      ?compatibility="${compatibility}"
      .selected="${selected}"
      @selected-changed="${this._tabsHandler}"
      scrollable
      disabledrag
      class="tabs"
      id="tabs"
    >
      ${items.map((item, index) => html`
      <anypoint-tab
        data-index="${index}"
        ?compatibility="${compatibility}"
        draggable="${draggableEnabled ? 'true' : 'false'}"
        @dragstart="${this._dragStart}"
        @dragend="${this._dragEnd}"
      >
        <span class="tab-name">${this._computeTabName(item.name, item.url)}</span>
        <span
          class="icon close-icon"
          data-index="${index}"
          @click="${this._closeRequest}"
        >
          ${close}
        </span>
      </anypoint-tab>`)}
      <anypoint-icon-button
        class="add-request-button"
        @click="${this.addEmptyRequest}"
        title="Add new request editor"
        aria-label="Activate to add new request"
      >
        <span class="icon">
          ${add}
        </span>
      </anypoint-icon-button>
    </anypoint-tabs>`;
  }

  _requestEditorTemplate() {
    const {
      editorOpened,
      noAutoProjects,
      compatibility,
      outlined
    } = this;
    return html`
    <bottom-sheet
      .opened="${editorOpened}"
      @overlay-opened="${this._resizeSheetContent}"
      data-property="editorOpened"
      @overlay-closed="${this._bottomSheetClosed}"
    >
      <saved-request-editor
        id="requestEditor"
        ?compatibility="${compatibility}"
        ?outlined="${outlined}"
        @cancel="${this._cancelRequestEdit}"
        @save-request="${this._saveRequestEdit}"
        @auto-projects="${noAutoProjects}"
      ></saved-request-editor>
    </bottom-sheet>
    `;
  }

  _requestDetailsTemplate() {
    const {
      detailsOpened,
      compatibility
    } = this;
    return html`
    <bottom-sheet
      .opened="${detailsOpened}"
      @overlay-opened="${this._resizeSheetContent}"
      data-property="detailsOpened"
      @overlay-closed="${this._bottomSheetClosed}"
    >
      <saved-request-detail
        id="requestDetails"
        ?compatibility="${compatibility}"
        @delete-request="${this._deleteRequestDetails}"
        @edit-request="${this._editRequestDetails}"
      ></saved-request-detail>
    </bottom-sheet>
    `;
  }

  _workspaceDetailsTemplate() {
    const {
      workspaceDetailsOpened,
      compatibility
    } = this;
    return html`
    <bottom-sheet
      .opened="${workspaceDetailsOpened}"
      @overlay-opened="${this._resizeSheetContent}"
      data-property="workspaceDetailsOpened"
      @overlay-closed="${this._bottomSheetClosed}"
    >
      <arc-workspace-detail
        id="workspaceDetails"
        ?compatibility="${compatibility}"
        @edit="${this.openWorkspaceEditor}"
      ></arc-workspace-detail>
    </bottom-sheet>`;
  }

  _workspaceEditorTemplate() {
    const {
      workspaceEditorOpened,
      compatibility
    } = this;
    return html`
    <bottom-sheet
      .opened="${workspaceEditorOpened}"
      @overlay-opened="${this._resizeSheetContent}"
      data-property="workspaceEditorOpened"
      @overlay-closed="${this._bottomSheetClosed}"
    >
      <arc-workspace-editor
        id="workspaceEditor"
        ?compatibility="${compatibility}"
        @cancel="${this._cancelWorkspaceEdit}"
        @save="${this._updateWorkspaceMeta}"
      ></arc-workspace-editor>
    </bottom-sheet>`;
  }

  _exportOptionsTemplate() {
    const {
      _exportOptionsOpened,
      _exportOptions,
      compatibility,
      outlined,
      withEncrypt
    } = this;
    return html`
    <bottom-sheet
      id="exportOptionsContainer"
      .opened="${_exportOptionsOpened}"
      @overlay-opened="${this._resizeSheetContent}"
      data-property="_exportOptionsOpened"
      @overlay-closed="${this._bottomSheetClosed}"
    >
      <export-options
        ?compatibility="${compatibility}"
        ?outlined="${outlined}"
        ?withEncrypt="${withEncrypt}"
        .file="${_exportOptions.file}"
        .provider="${_exportOptions.provider}"
        .providerOptions="${_exportOptions.providerOptions}"
        @accept="${this._acceptExportOptions}"
        @cancel="${this._cancelExportOptions}"
      ></export-options>
    </bottom-sheet>`;
  }

  render() {
    const {
      restoring,
      webSessionUrl
    } = this;
    return html`
    <div class="tabs-row">
      ${this._tabsTemplate()}
      <paper-progress indeterminate ?disabled="${!restoring}"></paper-progress>
    </div>
    <section class="requests-list" id="content"></section>
    <uuid-generator id="uuid"></uuid-generator>
    ${this._requestEditorTemplate()}
    ${this._requestDetailsTemplate()}
    ${this._workspaceDetailsTemplate()}
    ${this._workspaceEditorTemplate()}
    ${this._exportOptionsTemplate()}

    <section class="drop-target">
      <p class="drop-message">Drop import file here</p>
    </section>

    <paper-toast
      id="noExport"
      class="error-toast" text="Export module not found. Please, report an issue."></paper-toast>
    <paper-toast id="driveSaved" text="Requests saved on Google Drive."></paper-toast>
    <paper-toast id="errorToast" class="error-toast"></paper-toast>

    <web-url-input
      id="webUrlInput"
      purpose="web-session"
      .value="${webSessionUrl}"
      @value-changed="${this._sessionUrlChanged}"
    ></web-url-input>`;
  }
}
