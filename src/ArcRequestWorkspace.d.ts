/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   src/ArcRequestWorkspace.js
 */


// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

import {LitElement, html} from 'lit-element';

import {ArcFileDropMixin} from '@advanced-rest-client/arc-file-drop-mixin/arc-file-drop-mixin.js';

import {ArcWorkspaceRequestsMixin} from './ArcWorkspaceRequestsMixin.js';

import {ArcWorkspaceDndMixin} from './ArcWorkspaceDndMixin.js';

import {ArcWorkspaceStateMixin} from './ArcWorkspaceStateMixin.js';

export {ArcRequestWorkspace};

declare namespace UiElements {

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
   */
  class ArcRequestWorkspace extends
    ArcWorkspaceRequestsMixin(
    ArcWorkspaceDndMixin(
    ArcWorkspaceStateMixin(
    ArcFileDropMixin(
    Object)))) {
    readonly workspaceEditor: any;
    readonly workspaceDetails: any;
    readonly requestDetails: any;
    readonly requestEditor: any;
    readonly uuid: any;
    readonly webUrlInput: any;

    /**
     * Index of selected request panel
     */
    selected: number|null|undefined;
    readonly restoring: any;
    readonly initialized: any;

    /**
     * List of currently loaded requests
     */
    activeRequests: Array<object|null>|null;

    /**
     * Currently selected workspace.
     * When this value change it triggers workspace state change.
     */
    environment: string|null|undefined;

    /**
     * Workspace variables.
     * It is added to each request sent from this worksapce so the request logic
     * can apply additional variables.
     */
    variables: Array<object|null>|null;

    /**
     * Each request sent from this workspace timeout.
     */
    requestTimeout: Number|null;

    /**
     * Added to all requests sent from this workspace.
     * Instructs the transport library to validate SSL certificates.
     */
    validateCertificates: Boolean|null;

    /**
     * Added to all requests sent from this workspace.
     * Instructs the transport library how to manage redirects.
     */
    followRedirects: Boolean|null;

    /**
     * Added to all requests sent from this workspace.
     * Instructs the transport library to limit the size of the source message
     * sent to the server returned by the library. It is used to limit
     * memory use when reading the response.
     */
    sentMessageLimit: Number|null;

    /**
     * When set writing to the workspace state file is disabled.
     */
    workspaceReadOnly: number|null|undefined;

    /**
     * When set requests made from this workspace won't evaluate variables.
     */
    variablesDisabled: Boolean|null;

    /**
     * When set requests made from this workspace will be executed using
     * Node's native HTTP(S) transport.
     * Note, this option is only available for Electron app.
     */
    nativeTransport: Boolean|null;

    /**
     * If set then workspace restoration process is in progress.
     */
    _restoring: boolean|null|undefined;

    /**
     * The component automatically ask to restore workspace when connected
     * to the DOM. This ensures to prohibit auto restore request.
     */
    noAutoRestore: boolean|null|undefined;

    /**
     * When set the request meta data editor is opened.
     */
    editorOpened: boolean|null|undefined;

    /**
     * When set the request meta data viewer is opened.
     */
    detailsOpened: boolean|null|undefined;

    /**
     * When set the workspace meta data viewer is opened.
     */
    workspaceDetailsOpened: boolean|null|undefined;

    /**
     * When set the workspace meta data editor is opened.
     */
    workspaceEditorOpened: boolean|null|undefined;

    /**
     * Set when workspace state has been read.
     */
    _initialized: boolean|null|undefined;

    /**
     * When set the elements that require project data won't automatically
     * ask for project data.
     */
    noAutoProjects: boolean|null|undefined;

    /**
     * If set it renders the view in the narrow layout.
     */
    narrow: boolean|null|undefined;

    /**
     * Redirect URL for the OAuth2 authorization.
     * If can be also set by dispatching `oauth2-redirect-url-changed`
     * with `value` property on the `detail` object.
     */
    oauth2RedirectUri: string|null|undefined;

    /**
     * Variable set from workspace configuration. The same as `oauth2RedirectUri`
     * but it takes precedence over it.
     */
    _workspaceOauth2RedirectUri: String|null;

    /**
     * Computed final value of oauth2 redirect URI passed to the request panel.
     */
    _oauth2RedirectUri: String|null;

    /**
     * When set it will ignore all `content-*` headers when the request method
     * is either `GET` or `HEAD`. This is passed to the request panel.
     * When not set or `false` it renders warning dialog.
     */
    ignoreContentOnGet: Boolean|null;

    /**
     * An URL to be present in the session URL input when opened.
     * The input can be opened by calling `openWebUrlInput()`
     */
    webSessionUrl: string|null|undefined;

    /**
     * Workspace file version.
     * Has no meaning for the request processing but this information is rendered
     * in request workspace details dialog.
     */
    version: String|null;

    /**
     * Workspace publication date as an ISO date string.
     * Has no meaning for the request processing but this information is rendered
     * in request workspace details dialog.
     */
    published: String|null;

    /**
     * Workspace description.
     */
    description: string|null|undefined;

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
     */
    provider: object|null;

    /**
     * Enables compatibility with Anypoint platform
     */
    compatibility: boolean|null|undefined;

    /**
     * Enables material's outlined theme for inputs.
     */
    outlined: boolean|null|undefined;

    /**
     * Indicates that the export options panel is currently rendered.
     */
    _exportOptionsOpened: boolean|null|undefined;
    _exportOptions: object|null|undefined;
    connectedCallback(): void;
    disconnectedCallback(): void;
    updated(changedProperties: any): void;

    /**
     * Dispatches bubbling and composed custom event.
     * By default the event is cancelable until `cancelable` property is set to false.
     *
     * @param type Event type
     * @param detail A detail to set
     * @param cancelable When false the event is not cancelable.
     */
    _dispatch(type: String|null, detail: any|null, cancelable: Boolean|null): CustomEvent|null;

    /**
     * Finds first position where the request is empty.
     *
     * @returns Index of empty request or `-1`.
     */
    _getEmptyPosition(): Number|null;

    /**
     * Computes name for a tab.
     *
     * @param name Request name
     * @param url Request URL
     * @returns Tab name which is (in order) name, url, or "New request".
     */
    _computeTabName(name: String|null, url: String|null): String|null;

    /**
     * Appends request to the list of `activeRequests` and selects it.
     *
     * Note, the request data are passed after rext render frame so returned
     * index referes to empty object at the time when it's returned.
     *
     * @param request ArcRequest object.
     * @param opts Add request options:
     * - skipPositionCheck {Boolean} - Won't check for empty panel before
     * appending it to the list
     * - noAutoSelect {Boolean} - Won't attempt to select added request
     * @returns Index of newly created request.
     */
    appendRequest(request: object|null, opts: object|null): Number|null;

    /**
     * Adds a request at specific position moving the request at the position to the right.
     * If the position is out of `activeRequests` bounds
     *
     * @param index The position of the tab where to put the request
     * @param request Request object to put.
     * @param opts Add request options:
     * - noAutoSelect {Boolean} - Won't attempt to select added request
     */
    appendRequestAt(index: Number|null, request: object|null, opts: object|null): void;

    /**
     * Adds an empty request to the workspace.
     */
    addEmptyRequest(): void;

    /**
     * Updates request on a specific position.
     *
     * @param request ArcRequest object
     * @param index Request index
     */
    updateRequestObject(request: object|null, index: Number|null): void;

    /**
     * Handler for click event on the request close button.
     */
    _closeRequest(e: ClickEvent|null): void;

    /**
     * Removes request for given index
     *
     * @param index Request index in the `activeRequests` liost.
     * @param removeOnly When true it only removes the panel but
     * will not check for the selection state and if empty panel is needed
     */
    removeRequest(index: Number|null, removeOnly: Boolean|null): void;

    /**
     * Update tabs selection.
     */
    refreshTabs(): void;

    /**
     * Notifies workspace state change when selected request changes.
     *
     * @param selected item
     */
    _selectedChanged(selected: Number|null): void;

    /**
     * Updates environment value in the state file when it's value change.
     */
    _envChangedHandler(e: CustomEvent|null): void;

    /**
     * Finds requests index in the list of active requests.
     *
     * @param requestId Saved request ID
     * @param tmpId An ID created by this component to identify
     * not saved request.
     * @returns Request index or -1 if not found.
     */
    findRequestIndex(requestId: String|null, tmpId: String|null): Number|null;

    /**
     * Finds a request associated with the menu item which is the target of the
     * event. The menu item has to have `data-id` property set to request ID.
     *
     * @returns Request object or undefined if not found.
     */
    _getMenuRequest(e: ClickEvent|null): object|null|undefined;

    /**
     * Opens save editor
     */
    _requestStoreHandler(e: CustomEvent|null): void;

    /**
     * Opens the request details view
     */
    _renderRequestDetail(e: CustomEvent|null): void;

    /**
     * Open export dialog and sets `_exportItem` on the element.
     */
    _exportMenuHandler(e: ClickEvent|null): void;
    _cancelExportOptions(): void;
    _acceptExportOptions(e: any): any;

    /**
     * Calls `_dispatchExportData()` with parameters.
     *
     * @param request A request to export
     * @param detail Export configuration
     */
    _exportRequest(request: object|null, detail: String|null): Promise<any>|null;

    /**
     * Dispatches `arc-data-export` event and returns it.
     *
     * @param request The request to export.
     */
    _dispatchExportData(request: object|null, opts: object|null): CustomEvent|null;

    /**
     * Handler for non cancelable `request-object-changed` custom event.
     * Updates request object if it's one of currently opened objects.
     */
    _requestChangeHandler(e: CustomEvent|null): void;

    /**
     * A handler for `request-object-deleted` custom event.
     * Checks if deleted request is one of curerently rendered. If found it
     * removes information related to "saved" request.
     */
    _requestDeleteHandler(e: CustomEvent|null): void;

    /**
     * Adds request(s) by id.
     *
     * @param type A request type. `history` or `saved`
     * @param id Request id or list of ids
     */
    addRequestById(type: String|null, id: String|Array<String|null>|null): Promise<any>|null;

    /**
     * Replaces current workspace with a request(s) passed in the argument.
     *
     * @param type A request type. `history` or `saved`
     * @param id Request id or list of ids
     */
    replaceByRequestId(type: String|null, id: String|Array<String|null>|null): Promise<any>|null;

    /**
     * Clears the workspace. Adds new empty request when ready.
     *
     * @param ignoreAdd If set it won't add empty panel.
     */
    clearWorkspace(ignoreAdd: Boolean|null): void;

    /**
     * Adds requests by a project.
     *
     * @param project Project id or project object
     * @param index Position where to start adding requests from the project.
     */
    appendByProject(project: String|object|null, index: Number|null): Promise<any>|null;

    /**
     * Replace current workspace data by a project.
     *
     * @param project Project id or project object
     */
    replaceByProject(project: String|object|null): Promise<any>|null;

    /**
     * Handler for `workspace-open-project-requests` dispatched by projects
     * menu.
     *
     * @param e Detail object contains `project` which can be
     * string as project ID or project object and `replace` which determines
     * if the workspace state should be replaced.
     */
    _openProjectHandler(e: CustomEvent|null): void;

    /**
     * Replaces current workspace with the request data passed as an argument.
     *
     * @param requests List of ArcRequest objects to use.
     */
    replaceByRequestsData(requests: Array<object|null>|null): void;

    /**
     * Informs components to store request data.
     *
     * @param opts Optional. If `source` property is set it
     * dispatches `save-request` custom event immidietly. Otherwise dialog
     * is shown.
     */
    saveOpened(opts: object|null): void;

    /**
     * Called to request resize on opened `bottom-sheet` element.
     */
    _resizeSheetContent(e: CustomEvent|null): void;

    /**
     * Render saved dialog (bottom-sheet)
     *
     * @param request Request to set on the editor
     */
    _openSaveDialog(request: object|null): void;

    /**
     * Cancels request edit dialog and closes the dialog.
     */
    _cancelRequestEdit(e: CustomEvent|null): void;

    /**
     * Closes request edit dialog when save event is dispatched.
     */
    _saveRequestEdit(): void;

    /**
     * Handler for the delete action from the details popup.
     */
    _deleteRequestDetails(e: CustomEvent|null): void;
    _editRequestDetails(e: any): void;

    /**
     * Returns a reference to currently selected panel.
     */
    getActivePanel(): HTMLElement|null;

    /**
     * Runs cureently active tab.
     */
    sendCurrent(): void;

    /**
     * Aborts currenlt selected panel
     */
    abortCurrent(): void;

    /**
     * Aborts currenlt selected panel
     */
    clearCurrent(): void;

    /**
     * Aborts all running requests
     */
    abortAll(): void;

    /**
     * Appends Project/Saved/History export data directly to workspace.
     *
     * @param detail Arc import object with normalized import structure.
     */
    appendImportRequests(detail: object|null): void;

    /**
     * Handler for `request-workspace-append` custom event. Appends request
     * to the worspace.
     *
     * @param e A `request` property on detail object is expected.
     */
    _appendRequestHandler(e: CustomEvent|null): void;

    /**
     * Adds workspace configuration to the request object.
     * This overrides application configuration.
     * The function won't set configuration property when it is already set on the request.
     *
     * @param e `api-request` event dispatched from any panel.
     */
    _sendRequestHandler(e: CustomEvent|null): void;

    /**
     * Duplicates tab values at a position
     *
     * @param index Selected tab
     */
    duplicateTab(index: Number|null): void;

    /**
     * Removes all stored properties in a request object to prepare ArcRequest object.
     */
    _clearRequestMeta(request: object|null, includeIds: Boolean|null): object|null;

    /**
     * Closes currently selected tab.
     */
    closeActiveTab(): void;
    _oauthUriChanged(value: any): void;
    _setOauthRedirect(): void;

    /**
     * Opens the input for opening web app to start a web session.
     *
     * The input, when accepted, dispatches `open-web-url` custom event which is
     * not handled by this element. The application should handle this event
     * and open browser window or other mean to start a web session.
     */
    openWebUrlInput(): void;

    /**
     * Opens workspace metadata viewer.
     */
    openWorkspaceDetails(): void;

    /**
     * Opens workspace metadata editor.
     */
    openWorkspaceEditor(): void;

    /**
     * Closes workspace metadata edit dialog due to user cancelation.
     */
    _cancelWorkspaceEdit(): void;

    /**
     * Updates properties from save workspace event.
     */
    _updateWorkspaceMeta(e: CustomEvent|null): void;

    /**
     * Generates file name for the export options panel.
     */
    _generateExportFileName(): String|null;
    _sessionUrlChanged(e: any): void;
    _tabsHandler(e: any): void;
    _bottomSheetClosed(e: any): void;
    _tabsTemplate(): any;
    _requestEditorTemplate(): any;
    _requestDetailsTemplate(): any;
    _workspaceDetailsTemplate(): any;
    _workspaceEditorTemplate(): any;
    _exportOptionsTemplate(): any;
    render(): any;
  }
}