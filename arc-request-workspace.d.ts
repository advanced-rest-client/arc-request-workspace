/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   arc-request-workspace.html
 */


// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

/// <reference path="../polymer/types/polymer-element.d.ts" />
/// <reference path="../polymer/types/lib/elements/dom-repeat.d.ts" />
/// <reference path="../polymer/types/lib/utils/render-status.d.ts" />
/// <reference path="../polymer/types/lib/mixins/gesture-event-listeners.d.ts" />
/// <reference path="../paper-tabs/paper-tabs.d.ts" />
/// <reference path="../paper-tabs/paper-tab.d.ts" />
/// <reference path="../iron-icon/iron-icon.d.ts" />
/// <reference path="../arc-icons/arc-icons.d.ts" />
/// <reference path="../paper-item/paper-icon-item.d.ts" />
/// <reference path="../paper-icon-button/paper-icon-button.d.ts" />
/// <reference path="../request-panel/request-panel.d.ts" />
/// <reference path="../paper-progress/paper-progress.d.ts" />
/// <reference path="../uuid-generator/uuid-generator.d.ts" />
/// <reference path="../paper-styles/shadow.d.ts" />
/// <reference path="../saved-request-editor/saved-request-editor.d.ts" />
/// <reference path="../saved-request-detail/saved-request-detail.d.ts" />
/// <reference path="../http-code-snippets/http-code-snippets.d.ts" />
/// <reference path="../bottom-sheet/bottom-sheet.d.ts" />
/// <reference path="../arc-file-drop-mixin/arc-file-drop-mixin.d.ts" />
/// <reference path="../paper-toast/paper-toast.d.ts" />
/// <reference path="arc-workspace-requests-mixin.d.ts" />
/// <reference path="arc-workspace-dnd-mixin.d.ts" />
/// <reference path="arc-workspace-state-mixin.d.ts" />

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
   * `--arc-request-workspace` | Mixin applied to this elment | `{}`
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
   */
  class ArcRequestWorkspace extends
    ArcComponents.ArcWorkspaceRequestsMixin(
    ArcComponents.ArcWorkspaceDndMixin(
    ArcComponents.ArcWorkspaceStateMixin(
    ArcComponents.ArcFileDropMixin(
    Object)))) {

    /**
     * The OAuth2 redirect URI to pass to the authorization panel.
     */
    redirectUri: string|null|undefined;

    /**
     * Index of selected request panel
     */
    selected: number|null|undefined;

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
     * If set then workspace restoration process is in progress.
     */
    readonly restoring: boolean|null|undefined;

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
     * When set the code snippets element is opened.
     */
    snippetsOpened: boolean|null|undefined;

    /**
     * A request object to be passed to the code snippets element.
     */
    snippetRequest: boolean|null|undefined;

    /**
     * Set when workspace state has been read.
     */
    readonly initialized: boolean|null|undefined;

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
    connectedCallback(): void;
    disconnectedCallback(): void;

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
    _computeTabName(name: any, url: any): any;

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
     * Notifies workspace state change when request data changes.
     *
     * @param record Requests record change
     */
    _requestsListChanged(record: object|null): void;

    /**
     * Updates environment value in the state file when it's value change.
     */
    _envChangedHandler(e: CustomEvent|null): void;

    /**
     * Observer for workspace variable change.
     * Notifies workspace state change when needed.
     *
     * @param record Polymer's change record
     */
    _variablesChanged(record: object|null): void;

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
     * Dispatches `request-code-snippets` event with `request` object on the
     * detail.
     */
    _renderCodeSnippets(e: CustomEvent|null): void;

    /**
     * Handler for the store to file request menu item.
     */
    _requestStoreFileHandler(e: ClickEvent|null): void;

    /**
     * Handler for the store to Drive request menu item.
     */
    _requestStoreDriveHandler(e: ClickEvent|null): void;

    /**
     * Runs export flow.
     *
     * @param request Request object to export.
     * @param destination Destination supported by the export component.
     */
    _exportRequest(request: object|null, destination: String|null): Promise<any>|null;

    /**
     * Dispatches `export-data` event and returns it.
     *
     * @param destination A place where export the data (file, drive)
     */
    _dispatchExportData(destination: String|null, requests: Array<object|null>|Boolean|null): CustomEvent|null;

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
     */
    appendByProject(project: String|object|null): Promise<any>|null;

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
    _narrowChanged(value: any): void;
    _oauthUriChanged(value: any): void;
  }
}

interface HTMLElementTagNameMap {
  "arc-request-workspace": UiElements.ArcRequestWorkspace;
}
