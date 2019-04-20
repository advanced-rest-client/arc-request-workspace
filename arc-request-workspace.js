import {PolymerElement} from '../../@polymer/polymer/polymer-element.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
import {afterNextRender} from '../../@polymer/polymer/lib/utils/render-status.js';
import '../../@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import '../../@polymer/paper-tabs/paper-tabs.js';
import '../../@polymer/paper-tabs/paper-tab.js';
import '../../@polymer/iron-icon/iron-icon.js';
import '../../@advanced-rest-client/arc-icons/arc-icons.js';
import '../../@polymer/paper-item/paper-icon-item.js';
import '../../@polymer/paper-icon-button/paper-icon-button.js';
import '../../@advanced-rest-client/request-panel/request-panel.js';
import '../../@polymer/paper-progress/paper-progress.js';
import '../../@advanced-rest-client/uuid-generator/uuid-generator.js';
import '../../@advanced-rest-client/saved-request-editor/saved-request-editor.js';
import '../../@advanced-rest-client/saved-request-detail/saved-request-detail.js';
import '../../@advanced-rest-client/http-code-snippets/http-code-snippets.js';
import '../../@advanced-rest-client/bottom-sheet/bottom-sheet.js';
import '../../@advanced-rest-client/web-url-input/web-url-input.js';
import {ArcFileDropMixin} from '../../@advanced-rest-client/arc-file-drop-mixin/arc-file-drop-mixin.js';
import '../../@polymer/paper-toast/paper-toast.js';
import {ArcWorkspaceRequestsMixin} from './arc-workspace-requests-mixin.js';
import {ArcWorkspaceDndMixin} from './arc-workspace-dnd-mixin.js';
import {ArcWorkspaceStateMixin} from './arc-workspace-state-mixin.js';
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
 * `--arc-request-workspace-tabs-close-color-hover` | Color of tab close button when hovered | `rgba(255, 255, 255, 0.54)`
 * `--arc-request-workspace-tabs-close-background-color-hover` | Background color of tab close button when hovered | `#FF8A65`
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
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof UiElements
 * @appliesMixin ArcWorkspaceRequestsMixin
 * @appliesMixin ArcWorkspaceDndMixin
 * @appliesMixin ArcWorkspaceStateMixin
 * @appliesMixin ArcFileDropMixin
 */
class ArcRequestWorkspace extends
  ArcFileDropMixin(
    ArcWorkspaceRequestsMixin(ArcWorkspaceDndMixin(ArcWorkspaceStateMixin(PolymerElement)))) {
  static get template() {
    return html`<style>
    :host {
      display: block;
      position: relative;
    }

    [hidden] {
      display: none !important;
    }

    .tabs-row {
      background-color: var(--arc-request-workspace-tabs-backgroud-color, rgba(0, 0, 0, 0.05));
      border-bottom: 1px var(--arc-request-workspace-tabs-border-color, #e5e5e5) solid;
      position: relative;
    }

    .tabs-row paper-tabs {
      --paper-tabs-content: {
        font-family: var(--arc-font-family);
        height: 100%;
        border-bottom: 0 solid transparent;
        font-style: normal;
        color: var(--arc-request-workspace-tabs-color, rgba(0,0,0,0.87));
      };
      --paper-tabs-selection-bar: {
        z-index: 10;
        border-width: var(--tabs-selection-width);
        border-color: var(--primary-color);
      };
    }

    .tab-name {
      font-size: 13px;
      margin-right: 8px;
      max-width: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .close-icon {
      color: var(--arc-request-workspace-tabs-close-color, rgba(0, 0, 0, 0.78));
      border-radius: 50%;
      width: 14px;
      height: 14px;
    }

    .close-icon:hover {
      color: var(--arc-request-workspace-tabs-close-color-hover, rgba(255, 255, 255, 0.54));
      background-color: var(--arc-request-workspace-tabs-close-background-color-hover, #FF8A65);
    }

    .add-request-button {
      color: var(--arc-request-workspace-tabs-add-color, #616161);
      background-color: var(--arc-request-workspace-tabs-add-background-color);
      height: 40px;
      cursor: pointer;
      margin-top: 4px;
    }

    .add-request-button:hover {
      color: var(--arc-request-workspace-tabs-add-color-hover, #616161);
      background-color: var(--arc-request-workspace-tabs-add-background-color-hover);
    }

    paper-tab.iron-selected {
      background-color: var(--arc-request-workspace-tabs-selected-background-color, #fff);
    }

    paper-tab {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }

    paper-progress {
      position: absolute;
      bottom: -5px;
      left: 0;
      right: 0;
      width: 100%;
      display: none;
    }

    :host([restoring]) paper-progress {
      display: block;
    }

    .context-menu-icon {
      color: var(--request-editor-context-menu-icon-color, var(--primary-color));
    }

    .menu-item {
      font-size: var(--paper-item-font-size);
      padding: var(--paper-item-padding);
      color: var(--context-menu-item-color);
      background-color: var(--context-menu-item-background-color);

      border: none;
      outline: none;
      width: 100%;
      text-align: left;
    }

    .menu-item:hover {
      padding: var(--paper-item-hover-padding);
      border-left: var(--paper-item-hover-border-left);
      border-right: var(--paper-item-hover-border-right);
      color: var(--context-menu-item-color-hover);
      background-color: var(--context-menu-item-background-color-hover);
    }

    .tabs {
      color: var(--arc-request-workspace-tabs-color, rgba(0,0,0,0.87));
      position: relative;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
    }

    paper-tab {
      -webkit-user-select: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      user-select: none;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }

    .dragging {
      background-color: var(--arc-request-workspace-tab-dragging-background-color, #fff !important);
      z-index: 1;
      box-shadow: var(--box-shadow-2dp);
      --paper-tab-ink: transparent !important;
    }

    .moving {
      position: relative;
      -webkit-transition: -webkit-transform 0.1s ease-in-out;
      transition: transform 0.1s ease-in-out;
    }

    bottom-sheet {
      width: var(--bottom-sheet-width, 100%);
      max-width: var(--bottom-sheet-max-width, 700px);
    }

    .drop-target {
      display: none;
    }

    :host([dragging]) .drop-target {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 100;
      background-color: #fff;
      border: 4px var(--drop-file-importer-header-background-color, var(--primary-color)) solid;
    }

    .error-toast {
      background-color: var(--warning-primary-color, #FF7043);
      color: var(--warning-contrast-color, #fff);
    }

    .drop-pointer {
      position: absolute;
      left: 4px;
      color: #757575;
      width: 20px;
      height: 24px;
      font-size: 20px;
      top: 36px;
    }

    .drop-pointer::before {
      content: "⇧";
    }
    </style>
    <div class="tabs-row">
      <paper-tabs selected="{{selected}}" scrollable="" disable-drag="" class="tabs" id="tabs">
        <template is="dom-repeat" items="[[activeRequests]]" id="tabsRepeater">
          <paper-tab draggable="[[_computeDraggableValue(draggableEnabled)]]" on-dragstart="_dragStart" on-dragend="_dragEnd">
            <span class="tab-name">[[_computeTabName(item.name, item.url)]]</span>
            <iron-icon class="close-icon" icon="arc:close" data-index\$="[[index]]" on-click="_closeRequest"></iron-icon>
          </paper-tab>
        </template>
        <paper-icon-button class="add-request-button" icon="arc:add" on-click="addEmptyRequest" title="Add new request editor"></paper-icon-button>
      </paper-tabs>
      <paper-progress indeterminate="" disabled="[[!restoring]]"></paper-progress>
    </div>
    <section class="requests-list" id="content"></section>
    <uuid-generator id="uuid"></uuid-generator>

    <bottom-sheet opened="{{editorOpened}}" on-iron-overlay-opened="_resizeSheetContent">
      <saved-request-editor id="requestEditor" on-cancel-request-edit="_cancelRequestEdit" on-save-request="_saveRequestEdit" no-auto-projects="[[noAutoProjects]]"></saved-request-editor>
    </bottom-sheet>
    <bottom-sheet opened="{{detailsOpened}}" on-iron-overlay-opened="_resizeSheetContent">
      <saved-request-detail id="requestDetails" on-delete-request="_deleteRequestDetails" on-edit-request="_editRequestDetails"></saved-request-detail>
    </bottom-sheet>
    <bottom-sheet opened="{{snippetsOpened}}" on-iron-overlay-opened="_resizeSheetContent">
      <http-code-snippets url="[[snippetRequest.url]]" method="[[snippetRequest.method]]" headers="[[snippetRequest.headers]]" payload="[[snippetRequest.payload]]"></http-code-snippets>
    </bottom-sheet>

    <section class="drop-target">
      <p class="drop-message">Drop import file here</p>
    </section>

    <paper-toast id="noExport" class="error-toast" text="Export module not found. Please, report an issue."></paper-toast>
    <paper-toast id="driveSaved" text="Requests saved on Google Drive."></paper-toast>
    <paper-toast id="errorToast" class="error-toast"></paper-toast>

    <web-url-input id="webUrlInput" purpose="web-session" value="{{webSessionUrl}}"></web-url-input>`;
  }

  static get is() {
    return 'arc-request-workspace';
  }
  static get properties() {
    return {
      /**
       * Index of selected request panel
       */
      selected: {
        type: Number,
        observer: '_selectedChanged',
        notify: true
      },
      /**
       * List of currently loaded requests
       * @type {Array<Object>}
       */
      activeRequests: {
        type: Array,
        value: function() {
          return [];
        }
      },
      /**
       * Currently selected workspace.
       * When this value change it triggers workspace state change.
       */
      environment: {type: String, observer: '_workspaceConfigChanged'},
      /**
       * Workspace variables.
       * It is added to each request sent from this worksapce so the request logic
       * can apply additional variables.
       * @type {Array<Object>}
       */
      variables: Array,
      /**
       * Each request sent from this workspace timeout.
       * @type {Number}
       */
      requestTimeout: {type: Number, observer: '_workspaceConfigChanged'},
      /**
       * Added to all requests sent from this workspace.
       * Instructs the transport library to validate SSL certificates.
       * @type {Boolean}
       */
      validateCertificates: {type: Boolean, observer: '_workspaceConfigChanged'},
      /**
       * Added to all requests sent from this workspace.
       * Instructs the transport library how to manage redirects.
       * @type {Boolean}
       */
      followRedirects: {type: Boolean, observer: '_workspaceConfigChanged'},
      /**
       * Added to all requests sent from this workspace.
       * Instructs the transport library to limit the size of the source message
       * sent to the server returned by the library. It is used to limit
       * memory use when reading the response.
       * @type {Number}
       */
      sentMessageLimit: {type: Number, observer: '_workspaceConfigChanged'},
      /**
       * When set writing to the workspace state file is disabled.
       */
      workspaceReadOnly: {type: Number, observer: '_workspaceReadOnlyChanged'},
      /**
       * When set requests made from this workspace won't evaluate variables.
       * @type {Boolean}
       */
      variablesDisabled: {type: Boolean, observer: '_workspaceConfigChanged'},
      /**
       * When set requests made from this workspace will be executed using
       * Node's native HTTP(S) transport.
       * Note, this option is only available for Electron app.
       * @type {Boolean}
       */
      nativeTransport: {type: Boolean, observer: '_workspaceConfigChanged'},
      /**
       * If set then workspace restoration process is in progress.
       */
      restoring: {
        type: Boolean,
        readOnly: true,
        value: false,
        notify: true,
        reflectToAttribute: true
      },
      /**
       * The component automatically ask to restore workspace when connected
       * to the DOM. This ensures to prohibit auto restore request.
       */
      noAutoRestore: Boolean,
      /**
       * When set the request meta data editor is opened.
       */
      editorOpened: Boolean,
      /**
       * When set the request meta data viewer is opened.
       */
      detailsOpened: Boolean,
      /**
       * When set the code snippets element is opened.
       */
      snippetsOpened: Boolean,
      /**
       * A request object to be passed to the code snippets element.
       */
      snippetRequest: Boolean,
      /**
       * Set when workspace state has been read.
       */
      initialized: {type: Boolean, readOnly: true},
      /**
       * When set the elements that require project data won't automatically
       * ask for project data.
       */
      noAutoProjects: Boolean,
      /**
       * If set it renders the view in the narrow layout.
       */
      narrow: {type: Boolean, value: false, observer: '_narrowChanged'},
      /**
       * Redirect URL for the OAuth2 authorization.
       * If can be also set by dispatching `oauth2-redirect-url-changed`
       * with `value` property on the `detail` object.
       */
      oauth2RedirectUri: {type: String},
      /**
       * Variable set from workspace configuration. The same as `oauth2RedirectUri`
       * but it takes precedence over it.
       * @type {String}
       */
      _workspaceOauth2RedirectUri: {type: String, observer: '_workspaceConfigChanged'},
      /**
       * Computed final value of oauth2 redirect URI passed to the request panel.
       * @type {String}
       */
      _oauth2RedirectUri: {
        type: String,
        computed: '_computeOauth2RedirectUri(oauth2RedirectUri, _workspaceOauth2RedirectUri)',
        observer: '_oauthUriChanged'
      },
      /**
       * When set it will ignore all `content-*` headers when the request method
       * is either `GET` or `HEAD`. This is passed to the request panel.
       * When not set or `false` it renders warning dialog.
       * @type {Boolean}
       */
      ignoreContentOnGet: {type: Boolean, observer: '_ignoreContentOnGetChanged'},
      /**
       * An URL to be present in the session URL input when opened.
       * The input can be opened by calling `openWebUrlInput()`
       */
      webSessionUrl: {type: String, observer: '_workspaceConfigChanged'}
    };
  }

  static get observers() {
    return [
      '_requestsListChanged(activeRequests.*)',
      '_variablesChanged(variables.*)'
    ];
  }

  constructor() {
    super();
    this._envChangedHandler = this._envChangedHandler.bind(this);
    this._requestChangeHandler = this._requestChangeHandler.bind(this);
    this._requestDeleteHandler = this._requestDeleteHandler.bind(this);
    this._appendRequestHandler = this._appendRequestHandler.bind(this);
    this._sendRequestHandler = this._sendRequestHandler.bind(this);
    this._openProjectHandler = this._openProjectHandler.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('selected-environment-changed', this._envChangedHandler);
    window.addEventListener('request-object-changed', this._requestChangeHandler);
    window.addEventListener('request-object-deleted', this._requestDeleteHandler);
    window.addEventListener('request-workspace-append', this._appendRequestHandler);
    window.addEventListener('workspace-open-project-requests', this._openProjectHandler);
    this.addEventListener('api-request', this._sendRequestHandler);
    if (!this.noAutoRestore && !this.activeRequests.length) {
      afterNextRender(this, () => this.restoreWorkspace());
    }
    this.$.tabs._scroll = function() {};
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('selected-environment-changed', this._envChangedHandler);
    window.removeEventListener('request-object-changed', this._requestChangeHandler);
    window.removeEventListener('request-object-deleted', this._requestDeleteHandler);
    window.removeEventListener('request-workspace-append', this._appendRequestHandler);
    window.removeEventListener('workspace-open-project-requests', this._openProjectHandler);
    this.removeEventListener('api-request', this._sendRequestHandler);
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
      this.set(`activeRequests.${index}`, request);
      this.refreshTabs(request);
      this.__updatePanelRequest(panelId, request);
      lastAddedId = request._id;
    } else {
      if (!request._id) {
        request._id = this.$.uuid.generate();
      }
      const length = this.push('activeRequests', request);
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
      request._id = this.$.uuid.generate();
    }
    if (index >= this.activeRequests.length) {
      this.push('activeRequests', request);
    } else {
      this.splice('activeRequests', index, 0, request);
    }
    this.__addPanel(request);
    if (!opts.noAutoSelect) {
      this.selected = index;
    }
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
      console.warn('Trying to update non existing request');
      return;
    }
    const oldId = ar[index]._id;
    if (!request._id) {
      request._id = this.$.uuid.generate();
    }
    this.set(`activeRequests.${index}`, request);
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
    const removed = this.splice('activeRequests', index, 1);
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
    if (!this.activeRequests.length) {
      afterNextRender(this, () => {
        this.addEmptyRequest();
      });
    }
  }
  /**
   * Update tabs selection.
   */
  refreshTabs() {
    this.shadowRoot.querySelector('paper-tabs').notifyResize();
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
   * Notifies workspace state change when request data changes.
   *
   * @param {Object} record Requests record change
   */
  _requestsListChanged(record) {
    if (this.restoring) {
      return;
    }
    switch (record.path) {
      case 'activeRequests':
      case 'activeRequests.length':
        return;
      case 'activeRequests.splices':
        const splice = record.value.indexSplices && record.value.indexSplices[0];
        const removed = splice && splice.removed;
        if (!removed || !removed.length) {
          return;
        }
    }
    this._notifyStoreWorkspace();
    this.refreshTabs();
  }
  /**
   * Updates environment value in the state file when it's value change.
   *
   * @param {CustomEvent} e
   */
  _envChangedHandler(e) {
    if (e.composedPath()[0] === this || this.restoring) {
      return;
    }
    this.environment = e.detail.value;
  }
  /**
   * Observer for workspace variable change.
   * Notifies workspace state change when needed.
   * @param {Object} record Polymer's change record
   */
  _variablesChanged(record) {
    if (this.restoring) {
      return;
    }
    const {path} = record;
    if (!path || path.indexOf('.length') !== -1) {
      return;
    }
    this._notifyStoreWorkspace();
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
    e.preventDefault();
    e.stopPropagation();
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
    e.preventDefault();
    e.stopPropagation();
    const request = this._getMenuRequest(e);
    if (!request) {
      return;
    }
    this.$.requestDetails.request = request;
    this.detailsOpened = true;
  }
  /**
   * Dispatches `request-code-snippets` event with `request` object on the
   * detail.
   *
   * @param {CustomEvent} e
   */
  _renderCodeSnippets(e) {
    e.preventDefault();
    e.stopPropagation();
    const request = this._getMenuRequest(e);
    if (!request) {
      return;
    }
    this.snippetRequest = request;
    this.snippetsOpened = true;
  }
  /**
   * Handler for the store to file request menu item.
   * @param {ClickEvent} e
   */
  _requestStoreFileHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    const request = this._getMenuRequest(e);
    if (!request) {
      return;
    }
    this._exportRequest(request, 'file');
  }
  /**
   * Handler for the store to Drive request menu item.
   * @param {ClickEvent} e
   */
  _requestStoreDriveHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    const request = this._getMenuRequest(e);
    if (!request) {
      return;
    }
    this._exportRequest(request, 'drive');
  }
  /**
   * Runs export flow.
   * @param {Object} request Request object to export.
   * @param {String} destination Destination supported by the export component.
   * @return {Promise}
   */
  _exportRequest(request, destination) {
    const e = this._dispatchExportData(destination, [request]);
    if (!e.defaultPrevented) {
      this.$.noExport.opened = true;
      return;
    }
    return e.detail.result
    .then(() => {
      if (destination === 'drive') {
        this.$.driveSaved.opened = true;
      }
    })
    .catch((cause) => {
      this.$.errorToast.text = cause.message;
      this.$.errorToast.opened = true;
      console.warn(cause);
    });
  }
  /**
   * Dispatches `export-data` event and returns it.
   * @param {String} destination A place where export the data (file, drive)
   * @param {Array<Object>|Boolean} requests
   * @return {CustomEvent}
   */
  _dispatchExportData(destination, requests) {
    const e = new CustomEvent('export-data', {
      cancelable: true,
      composed: true,
      bubbles: true,
      detail: {
        type: 'arc-export',
        destination,
        file: 'arc-saved-export.json',
        kind: 'ARC#SavedExport',
        data: {
          requests
        }
      }
    });
    this.dispatchEvent(e);
    return e;
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
    this.set(`activeRequests.${index}`, e.detail.request);
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
    this.set(`activeRequests.${index}`, request);
    this.set(`activeRequests.${index}.name`, '');
  }
  /**
   * Adds request(s) by id.
   * @param {String} type A request type. `history` or `saved`
   * @param {String|Array<String>} id Request id or list of ids
   * @return {Promise}
   */
  addRequestById(type, id) {
    const ev = this._dispatch('request-object-read', {
      id,
      type,
      opts: {
        restorePayload: true
      }
    });
    if (!ev.defaultPrevented) {
      return Promise.reject(new Error('Request model not found'));
    }
    this._setRestoring(true);
    return ev.detail.result
    .then((result) => {
      if (!result) {
        this._setRestoring(false);
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
      this._setRestoring(false);
      this.selected = lastAddedPosition;
    });
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
    this.set('activeRequests', []);
    this.selected = undefined;
    if (ignoreAdd) {
      return;
    }
    afterNextRender(this, () => {
      this.addEmptyRequest();
    });
  }
  /**
   * Adds requests by a project.
   * @param {String|Object} project Project id or project object
   * @param {?Number} index Position where to start adding requests from the project.
   * @return {Promise}
   */
  appendByProject(project, index) {
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
    this._setRestoring(true);
    return e.detail.result
    .then((data) => {
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
      this._setRestoring(false);
      this.selected = lastIndex;
      this.refreshTabs();
    });
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
    const {project, replace} = e.detail;
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
    this._setRestoring(true);
    if (requests && requests.length) {
      let pos;
      for (let i = 0, len = requests.length; i < len; i++) {
        if (!requests[i]._id) {
          requests[i]._id = this.$.uuid.generate();
        }
        pos = this.appendRequest(requests[i], {
          skipPositionCheck: true,
          noAutoSelect: true
        });
      }
      this._setRestoring(false);
      this.selected = pos;
    } else {
      this._setRestoring(false);
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
      console.warn('There\'s no request to save.');
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
        'saved-request-editor,saved-request-detail,http-code-snippets');
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
      request._tempId = this.$.uuid.generate();
    }
    this.$.requestEditor.request = request;
    this.editorOpened = true;
  }
  /**
   * Cancels request edit dialog and closes the dialog.
   * @param {CustomEvent} e
   */
  _cancelRequestEdit(e) {
    e.stopPropagation();
    this.editorOpened = false;
    this.$.requestEditor.request = undefined;
  }
  /**
   * Closes request edit dialog when save event is dispatched.
   * @param {CustomEvent} e
   */
  _saveRequestEdit() {
    this.editorOpened = false;
    this.$.requestEditor.request = undefined;
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
    const request = this.$.requestDetails.request;
    this.detailsOpened = false;
    this.$.requestEditor.request = request;
    this.editorOpened = true;
  }
  /**
   * Returns a reference to currently selected panel.
   * @return {HTMLElement}
   */
  getActivePanel() {
    const request = this.activeRequests[this.selected];
    if (!request) {
      console.warn('Selected request does not exists');
      return;
    }
    const panel = this.__getPanelById(request._id);
    if (!panel) {
      console.warn('Request panel not found');
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
        console.warn('Unknown request-workspace-append event konfiguration.');
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
    const current = this.get('activeRequests.' + index);
    if (!current) {
      console.warn('No request at position ', index);
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

  _narrowChanged(value) {
    this.__updatePanelsProperty('narrow', value);
  }

  _oauthUriChanged(value) {
    this.__updatePanelsProperty('oauth2RedirectUri', value);
  }

  _computeOauth2RedirectUri(oauth2RedirectUri, workspaceOauth2RedirectUri) {
    return workspaceOauth2RedirectUri || oauth2RedirectUri;
  }

  _ignoreContentOnGetChanged(value) {
    this.__updatePanelsProperty('ignoreContentOnGet', value);
    // this._workspaceConfigChanged();
  }
  /**
   * Opens the input for opening web app to start a web session.
   *
   * The input, when accepted, dispatches `open-web-url` custom event which is
   * not handled by this element. The application should handle this event
   * and open browser window or other mean to start a web session.
   */
  openWebUrlInput() {
    this.$.webUrlInput.opened = true;
  }
}
window.customElements.define(ArcRequestWorkspace.is, ArcRequestWorkspace);
