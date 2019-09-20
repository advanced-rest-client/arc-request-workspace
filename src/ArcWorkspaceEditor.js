/**
@license
Copyright 2018 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import { LitElement, html } from 'lit-element';
import { ArcResizableMixin } from '@advanced-rest-client/arc-resizable-mixin/arc-resizable-mixin.js';
import '@anypoint-web-components/anypoint-input/anypoint-input.js';
import '@anypoint-web-components/anypoint-input/anypoint-textarea.js';
import '@polymer/iron-collapse/iron-collapse.js';
import { arrowDropDown } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
import styles from './EditrStyles.js';

export class ArcWorkspaceEditor extends ArcResizableMixin(LitElement) {
  static get styles() {
    return styles;
  }

  static get properties() {
    return {
      // Workspace version string
      version: { type: String },
      // Published ISO date string
      published: { type: String },
      // Provider info
      provider: { type: Object },
      // Workspace description
      description: { type: String },
      // True when additional options are opened.
      providerInfoOpened: { type: Boolean },
      /**
       * Enables compatibility with Anypoint platform
       */
      compatibility: { type: Boolean },
      /**
       * Enables material's outlined theme for inputs.
       */
      outlined: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.provider = {};
  }

  _toggleOptions() {
    this.providerInfoOpened = !this.providerInfoOpened;
  }

  /**
   * Sends the `cancel-request-edit` custom event to cancel the edit.
   */
  _cancel() {
    this.dispatchEvent(new CustomEvent('cancel', {
      composed: true
    }));
  }
  /**
   * Sets `override` to `false` and sends the form.
   */
  _save() {
    const detail = this.serializeForm();
    this.dispatchEvent(new CustomEvent('save', {
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

  _inputHandler(e) {
    const { name, value } = e.target;
    if (name.indexOf('.') !== -1) {
      const [root, path] = name.split('.');
      this[root][path] = value;
    } else {
      this[name] = value;
    }
  }

  render() {
    const {
      compatibility
    } = this;
    return html`
    <h2>Edit workspace details</h2>
    ${this._descriptionTemplate()}
    ${this._varsionTemplate()}
    ${this._publishedTemplate()}
    ${this._additionalTemplate()}
    <div class="actions">
      <anypoint-button
        @click="${this._cancel}"
        data-action="cancel-edit"
        title="Cancels any changes"
        ?compatibility="${compatibility}"
      >Cancel</anypoint-button>
      <anypoint-button
        class="action-button"
        @click="${this._save}"
        data-action="save"
        title="Save workspace data"
        ?compatibility="${compatibility}"
      >Save</anypoint-button>
    </div>`;
  }

  _descriptionTemplate() {
    const {
      compatibility,
      outlined,
      description
    } = this;
    return html`
    <anypoint-textarea
      name="description"
      .value="${description}"
      @value-changed="${this._inputHandler}"
      ?compatibility="${compatibility}"
      ?outlined="${outlined}"
    >
      <label slot="label">Description</label>
    </anypoint-textarea>`;
  }

  _varsionTemplate() {
    const {
      compatibility,
      outlined,
      version
    } = this;
    return html`
    <anypoint-input
      name="version"
      .value="${version}"
      @value-changed="${this._inputHandler}"
      ?compatibility="${compatibility}"
      ?outlined="${outlined}"
    >
      <label slot="label">Version</label>
    </anypoint-input>`;
  }

  _publishedTemplate() {
    const {
      compatibility,
      outlined,
      published
    } = this;
    return html`
    <anypoint-input
      name="published"
      .value="${published}"
      @value-changed="${this._inputHandler}"
      ?compatibility="${compatibility}"
      ?outlined="${outlined}"
      type="datetime-local"
    >
      <label slot="label">Published</label>
    </anypoint-input>`;
  }

  _additionalTemplate() {
    const {
      providerInfoOpened
    } = this;
    return html`
    <section class="additional-options">
      <div
        class="caption"
        @click="${this._toggleOptions}"
        ?data-caption-opened="${providerInfoOpened}">
        Provider info
        <anypoint-icon-button
          class="caption-icon"
          aria-label="Activate to toggle additional options"
        >
          <span class="icon">${arrowDropDown}</span>
        </anypoint-icon-button>
      </div>
      <iron-collapse .opened="${providerInfoOpened}">
        <div class="options">
          ${this._providerNameTemplate()}
          ${this._providerUrlTemplate()}
          ${this._providerEmailTemplate()}
        </div>
      </iron-collapse>
    </section>`;
  }

  _providerNameTemplate() {
    const {
      compatibility,
      outlined
    } = this;
    const provider = this.provider || {};
    return html`
    <anypoint-input
      name="provider.name"
      .value="${provider.name}"
      @value-changed="${this._inputHandler}"
      ?compatibility="${compatibility}"
      ?outlined="${outlined}"
    >
      <label slot="label">Author</label>
    </anypoint-input>`;
  }

  _providerUrlTemplate() {
    const {
      compatibility,
      outlined
    } = this;
    const provider = this.provider || {};
    return html`
    <anypoint-input
      name="provider.url"
      .value="${provider.url}"
      @value-changed="${this._inputHandler}"
      ?compatibility="${compatibility}"
      ?outlined="${outlined}"
    >
      <label slot="label">Website</label>
    </anypoint-input>`;
  }

  _providerEmailTemplate() {
    const {
      compatibility,
      outlined
    } = this;
    const provider = this.provider || {};
    return html`
    <anypoint-input
      name="provider.email"
      .value="${provider.email}"
      @value-changed="${this._inputHandler}"
      ?compatibility="${compatibility}"
      ?outlined="${outlined}"
    >
      <label slot="label">Email</label>
    </anypoint-input>`;
  }
}
