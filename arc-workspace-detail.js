import {PolymerElement} from '../../@polymer/polymer/polymer-element.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
import {mixinBehaviors} from '../../@polymer/polymer/lib/legacy/class.js';
import {IronResizableBehavior} from '../../@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import '../../@advanced-rest-client/date-time/date-time.js';
import '../../@advanced-rest-client/arc-icons/arc-icons.js';
import '../../@polymer/paper-button/paper-button.js';
import '../../@polymer/iron-icon/iron-icon.js';
import '../../@polymer/marked-element/marked-element.js';
import '../../@advanced-rest-client/markdown-styles/markdown-styles.js';

class ArcWorkspaceDetail extends mixinBehaviors([IronResizableBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="markdown-styles"></style>
    <style>
    :host {
      display: block;
      color: var(--arc-workspace-detail-color, inherit);
      background-color: var(--arc-workspace-detail-background-color, inherit);
      padding: var(--arc-workspace-detail-padding);
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

    .description {
      max-width: var(--arc-workspace-detail-description-max-width, 700px);
      color: var(--arc-workspace-detail-description-color, rgba(0, 0, 0, 0.64));
    }

    .meta-row {
      display: flex;
      flex-direction: row;
      align-items: center;
      color: var(--arc-workspace-detail-data-list-color, rgba(0, 0, 0, 0.87));
      height: 40px;
    }

    .meta-row .label {
      width: 160px;
    }

    .meta-row .value {
      white-space: var(--arc-font-nowrap-white-space);
      overflow: var(--arc-font-nowrap-overflow);
      text-overflow: var(--arc-font-nowrap-text-overflow);
    }

    .actions {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      margin-top: 20px;
    }

    .actions paper-button {
      color: var(--arc-workspace-detail-action-button-color, var(--primary-color));
      background-color: var(--arc-workspace-detail-action-button-background-color);
      padding-left: 12px;
      padding-right: 12px;
    }

    paper-button iron-icon {
      margin-right: 12px;
      color: var(--arc-workspace-detail-action-icon-color, rgba(0, 0, 0, 0.54));
    }

    marked-element {
      margin-top: 20px;
    }

    .empty {
      font-style: italic;
    }
    </style>
    <h2>Workspace details</h2>

    <template is="dom-if" if="[[description]]">
      <marked-element markdown="[[description]]">
        <div class="markdown-html markdown-body description"></div>
      </marked-element>
    </template>

    <div class="meta-row">
      <div class="label">
        Version
      </div>
      <template is="dom-if" if="[[version]]">
        <div class="value">[[version]]</div>
      </template>
      <template is="dom-if" if="[[!version]]">
        <div class="value empty">No data</div>
      </template>
    </div>

    <div class="meta-row">
      <div class="label">
        Published
      </div>
      <template is="dom-if" if="[[published]]">
        <div class="value">
          <date-time
            date="[[published]]"
            year="numeric"
            month="numeric"
            day="numeric"
            hour="numeric"
            minute="numeric"></date-time>
        </div>
      </template>
      <template is="dom-if" if="[[!published]]">
        <div class="value empty">No data</div>
      </template>
    </div>

    <h3>Provider</h3>

    <div class="meta-row">
      <div class="label">
        Author
      </div>
      <template is="dom-if" if="[[provider.name]]">
        <div class="value">[[provider.name]]</div>
      </template>
      <template is="dom-if" if="[[!provider.name]]">
        <div class="value empty">No data</div>
      </template>
    </div>

    <div class="meta-row">
      <div class="label">
        Address
      </div>
      <template is="dom-if" if="[[provider.url]]">
        <div class="value">[[provider.url]]</div>
      </template>
      <template is="dom-if" if="[[!provider.url]]">
        <div class="value empty">No data</div>
      </template>
    </div>

    <div class="meta-row">
      <div class="label">
        Contact
      </div>
      <template is="dom-if" if="[[provider.email]]">
        <div class="value">[[provider.email]]</div>
      </template>
      <template is="dom-if" if="[[!provider.email]]">
        <div class="value empty">No data</div>
      </template>
    </div>


    <div class="actions">
      <paper-button
        on-click="_editMeta"
        data-action="edit-meta"
        title="Opens workspace editor">
        <iron-icon icon="arc:edit"></iron-icon>
        Edit
      </paper-button>
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
      description: String
    };
  }
  /**
   * Sends non-bubbling `edit-meta` event to the parent element to perform
   * edit action.
   */
  _editMeta() {
    this.dispatchEvent(new CustomEvent('edit-meta', {
      composed: true
    }));
  }
  /**
   * Fired when the user click on the "edit" action button.
   *
   * This event does not bubbles.
   *
   * @event edit-meta
   */
}
window.customElements.define('arc-workspace-detail', ArcWorkspaceDetail);
