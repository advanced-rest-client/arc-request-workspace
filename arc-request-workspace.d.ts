/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   arc-request-workspace.html
 */

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
/// <reference path="request-panels-mixin.d.ts" />

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
    ArcComponents.ArcWorkspaceMixin(
    ArcComponents.ArcFileDropMixin(
    Object)) {
    readonly _dragPossible: Boolean|null;

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
     * If set then workspace restoration process is in progress.
     */
    readonly restoring: boolean|null|undefined;

    /**
     * The component automatically ask to restore workspace when connected
     * to the DOM. This ensures to prohibit auto restore request.
     */
    noAutoRestore: boolean|null|undefined;
    editorOpened: boolean|null|undefined;
    detailsOpened: boolean|null|undefined;
    snippetsOpened: boolean|null|undefined;
    snippetRequest: boolean|null|undefined;

    /**
     * Set when workspace state has been read.
     */
    readonly initialized: boolean|null|undefined;
    connectedCallback(): void;
    disconnectedCallback(): void;

    /**
     * Restores workspace state.
     * It dispatches `workspace-state-read` custom event to query for workspace data
     * and restores requests if they were previously stored.
     */
    restoreWorkspace(): Promise<any>|null;

    /**
     * Restores workspace state from previously stored data.
     *
     * @param state Workspace state object
     */
    _restore(state: object|null): void;

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
    _closeRequest(e: any): void;

    /**
     * Removes request for given index
     *
     * @param index Request index in the `activeRequests` liost.
     * @param removeOnly When true it only removes the panel but
     * will not check for the selection state and if empty panel is needed
     */
    removeRequest(index: Number|null, removeOnly: Boolean|null): void;

    /**
     * Serializes workspace state to a JavaScript object.
     *
     * @returns An ArcWorkspace object
     */
    serializeWorkspace(): object|null;

    /**
     * Dispatches `workspace-state-store` custom event to store workspace data.
     * The type of the request is `workspace-state`.
     *
     * If there's an error it is not rerported back to the user.
     */
    _notifyStoreWorkspace(): void;

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
     * Notifies workspace change when environment changes.
     */
    _envChanged(): void;

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
     * It ensures `_id` property exists opens save editor
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
     * Handles track event dispatched by `Polymer.Gestures` library.
     * This method calls corresponding method to current dragging state.
     */
    _handleTrack(e: CustomEvent|null): void;
    _onTrackStart(e: any): void;
    _onTrack(e: any): void;

    /**
     * Performs operation when the tab drop occurs.
     */
    _onTrackEnd(): void;

    /**
     * Sets `readonly` state on all editors
     */
    _blockEditors(): void;

    /**
     * Removes `readonly` state from all editors
     */
    _unblockEditors(): void;

    /**
     * Gets the top level item from the DOM repeater that has been marked as a
     * draggable item.
     * The event can originate from child elements which shouldn't be dragged.
     *
     * @param e The track event
     * @returns An element that is container for draggable items. Undefined if couldn't
     * find.
     */
    _getReorderedItem(e: Event|null): HTMLElement|null;

    /**
     * Re-positions dragged element to the place where it belongs.
     * It accounts for scroll position if it changed since dragging started.
     *
     * @param dx Delta X from starting position.
     */
    _updateDragPosition(dx: Number|null): void;
    _updateTabPosition(ddx: any): void;

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
    _resizeSheetContent(e: any): void;
    _openSaveDialog(request: any): void;
    _cancelRequestEdit(e: any): void;
    _saveRequestEdit(): void;
    _deleteRequestDetails(e: any): void;
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
  }
}

interface HTMLElementTagNameMap {
  "arc-request-workspace": UiElements.ArcRequestWorkspace;
}
