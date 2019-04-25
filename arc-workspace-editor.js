import {PolymerElement} from '../../@polymer/polymer/polymer-element.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
import {mixinBehaviors} from '../../@polymer/polymer/lib/legacy/class.js';
import {IronResizableBehavior} from '../../@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import '../../@advanced-rest-client/arc-icons/arc-icons.js';
import '../../@polymer/paper-button/paper-button.js';
import '../../@polymer/iron-icon/iron-icon.js';
import '../../@polymer/paper-input/paper-input.js';
import '../../@polymer/paper-input/paper-textarea.js';
import '../../@polymer/iron-collapse/iron-collapse.js';
import '../../@polymer/paper-icon-button/paper-icon-button.js';

class ArcWorkspaceEditor extends mixinBehaviors([IronResizableBehavior], PolymerElement) {
  static get template() {
    return html`<style>
    :host {
      display: block;
      outline: none;
      color: var(--arc-workspace-editor-color, inherit);
      background-color: var(--arc-workspace-editor-background-color, inherit);
      padding: var(--arc-workspace-editor-padding);
      box-sizing: border-box;
      font-size: var(--arc-font-body1-font-size);
      font-weight: var(--arc-font-body1-font-weight);
      line-height: var(--arc-font-body1-line-height);
    }

    h2 {
      font-size: var(--arc-font-headline-font-size);
      font-weight: var(--arc-font-headline-font-weight);
      letter-spacing: var(--arc-font-headline-letter-spacing);
      line-height: var(--arc-font-headline-line-height);
    }

    .additional-options {
      color: var(--saved-request-editor-options-color, rgba(0, 0, 0, 0.74));
    }

    .caption {
      display: flex;
      flex-direction: row;
      align-items: center;
      cursor: pointer;
    }

    .caption-icon {
      color: var(--saved-request-editor-caption-icon-color, rgba(0, 0, 0, 0.74));
      transform: rotate(0deg);
      transition: 0.31s transform ease-in-out;
    }

    [data-caption-opened] .caption-icon {
      transform: rotate(-180deg);
    }

    .options {
      margin-top: 16px;
    }

    .actions {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      margin-top: 20px;
    }

    .actions paper-button {
      color: var(--saved-request-editor-action-button-color, var(--primary-color));
      background-color: var(--saved-request-editor-action-button-background-color);
      padding-left: 12px;
      padding-right: 12px;
    }

    .actions paper-button.action-button {
      background-color: var(--action-button-background-color, var(--primary-color));
      color: var(--action-button-color, white);
    }
    </style>
    <h2>Edit workspace details</h2>

    <paper-textarea
      id="autogrow"
      label="Description"
      value="{{description}}"
      on-bind-value-changed="_autogrowCheckResize"></paper-textarea>

    <paper-input
      label="Version"
      value="{{version}}"></paper-input>

    <paper-input
      label="Published"
      value="{{published}}"
      type="datetime-local"></paper-input>

    <section class="additional-options">
      <div class="caption" on-click="_toggleOptions" data-caption-opened\$="[[providerInfoOpened]]">
        Provider info
        <paper-icon-button icon="arc:arrow-drop-down" class="caption-icon"></paper-icon-button>
      </div>
      <iron-collapse opened="[[providerInfoOpened]]">
        <div class="options">
          <paper-input
            label="Author" value="{{provider.name}}"></paper-input>
          <paper-input
            label="Website" value="{{provider.url}}"></paper-input>
          <paper-input
            label="Email" value="{{provider.email}}" type="email"></paper-input>
        </div>
      </iron-collapse>
    </section>

    <div class="actions">
      <paper-button on-click="_cancel" data-action="cancel-edit" title="Cancels any changes">Cancel</paper-button>
      <paper-button class="action-button" on-click="_save" data-action="save"
        title="Save workspace data">Save</paper-button>
    </div>`;
  }

  static get properties() {
    return {
      // Workspace version string
      version: {type: String, value: false},
      // Published ISO date string
      published: {type: String, value: false},
      // Provider info
      provider: {type: Object, value: {}},
      // Workspace description
      description: String,
      // True when additional options are opened.
      providerInfoOpened: Boolean
    };
  }
  /**
   * Notifies resize when the height of autogrow textarea changes.
   */
  _autogrowCheckResize() {
    if (!this._lastAutogrowHeight) {
      this._lastAutogrowHeight = this.$.autogrow.offsetHeight;
      return;
    }
    if (this._lastAutogrowHeight !== this.$.autogrow.offsetHeight) {
      this._lastAutogrowHeight = this.$.autogrow.offsetHeight;
      this.notifyResize();
    }
  }

  _toggleOptions() {
    this.providerInfoOpened = !this.providerInfoOpened;
  }

  /**
   * Sends the `cancel-request-edit` custom event to cancel the edit.
   */
  _cancel() {
    this.dispatchEvent(new CustomEvent('cancel-edit', {
      composed: true
    }));
  }
  /**
   * Sets `override` to `false` and sends the form.
   */
  _save() {
    const detail = this.serializeForm();
    this.dispatchEvent(new CustomEvent('save-workspace', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail
    }));
  }
  /**
   * Serializes values into a form.
   * @return {[type]} [description]
   */
  serializeForm() {
    const result = {};
    if (this.version) {
      result.version = this.version;
    }
    if (this.published) {
      result.published = this.published;
    }
    if (this.description) {
      result.description = this.description;
    }
    const provider = this.provider;
    const providerResult = {};
    if (provider.url) {
      providerResult.url = provider.url;
    }
    if (provider.email) {
      providerResult.email = provider.email;
    }
    if (provider.name) {
      providerResult.name = provider.name;
    }
    if (Object.keys(providerResult).length) {
      result.provider = this.provider;
    }
    return result;
  }
}
window.customElements.define('arc-workspace-editor', ArcWorkspaceEditor);
