import { LitElement, html } from 'lit-element';
import { ArcResizableMixin } from '@advanced-rest-client/arc-resizable-mixin/arc-resizable-mixin.js';
import '@advanced-rest-client/date-time/date-time.js';
import { edit } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '@advanced-rest-client/arc-marked/arc-marked.js';
import markdownStyles from '@advanced-rest-client/markdown-styles/markdown-styles.js';
import styles from './DetailsStyles.js';

export class ArcWorkspaceDetail extends ArcResizableMixin(LitElement) {
  static get styles() {
    return [
      markdownStyles,
      styles
    ];
  }

  _noDataTemplate() {
    return html`<div class="value empty">No data</div>`;
  }

  _valueTemplate(value) {
    return value ? html`<div class="value">${value}</div>` : this._noDataTemplate();
  }

  render() {
    const provider = this.provider || {};
    const {
      description,
      version,
      published,
      compatibility
    } = this;
    return html`
    <h2>Workspace details</h2>
    ${description ? html`
    <arc-marked .markdown="${description}">
      <div class="markdown-html markdown-body description"></div>
    </arc-marked>` : ''}

    <div class="meta-row">
      <div class="label">
        Version
      </div>
      ${this._valueTemplate(version)}
    </div>

    <div class="meta-row">
      <div class="label">
        Published
      </div>
      ${published ? html`<div class="value">
        <date-time
          .date="${published}"
          year="numeric"
          month="numeric"
          day="numeric"
          hour="numeric"
          minute="numeric"
        ></date-time>
      </div>` : this._noDataTemplate()}
    </div>

    <h3>Provider</h3>

    <div class="meta-row">
      <div class="label">
        Author
      </div>
      ${this._valueTemplate(provider.name)}
    </div>

    <div class="meta-row">
      <div class="label">
        Address
      </div>
      ${this._valueTemplate(provider.url)}
    </div>

    <div class="meta-row">
      <div class="label">
        Contact
      </div>
      ${this._valueTemplate(provider.email)}
    </div>

    <div class="actions">
      <anypoint-button
        @click="${this._editMeta}"
        data-action="edit-meta"
        title="Opens workspace editor"
        ?compatibility="${compatibility}"
      >
        <span class="icon">${edit}</span>
        Edit
      </anypoint-button>
    </div>`;
  }

  static get properties() {
    return {
      // Workspace version string
      version: { type: String, value: false },
      // Published ISO date string
      published: { type: String, value: false },
      // Provider info
      provider: { type: Object, value: {} },
      // Workspace description
      description: String,
      /**
       * Enables compatibility with Anypoint platform
       */
      compatibility: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.provider = {};
  }
  /**
   * Sends non-bubbling `edit-meta` event to the parent element to perform
   * edit action.
   */
  _editMeta() {
    this.dispatchEvent(new CustomEvent('edit', {
      composed: true
    }));
  }
  /**
   * Fired when the user click on the "edit" action button.
   *
   * This event does not bubbles.
   *
   * @event edit
   */
}
