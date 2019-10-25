import { html } from 'lit-html';
import { ArcDemoPage } from '@advanced-rest-client/arc-demo-helper/ArcDemoPage.js';
import { DataGenerator } from '@advanced-rest-client/arc-data-generator/arc-data-generator.js';
import { search } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '@advanced-rest-client/arc-demo-helper/arc-interactive-demo.js';
import '@polymer/paper-toast/paper-toast.js';
import '@advanced-rest-client/variables-evaluator/variables-evaluator.js';
import '@advanced-rest-client/variables-manager/variables-manager.js';
import '@advanced-rest-client/variables-editor/variables-editor.js';
import '@advanced-rest-client/oauth-authorization/oauth2-authorization.js';
import '@advanced-rest-client/oauth-authorization/oauth1-authorization.js';
import '@advanced-rest-client/arc-models/url-history-model.js';
import '@advanced-rest-client/arc-models/variables-model.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@advanced-rest-client/arc-models/project-model.js';
import '@advanced-rest-client/arc-models/request-model.js';
import '@advanced-rest-client/arc-models/url-indexer.js';
import '@advanced-rest-client/arc-models/client-certificate-model.js';
import '@advanced-rest-client/request-hooks-logic/request-hooks-logic.js';
import '@advanced-rest-client/arc-request-logic/arc-request-logic.js';
import '@advanced-rest-client/arc-menu/saved-menu.js';
import '@advanced-rest-client/arc-menu/projects-menu.js';
import '@advanced-rest-client/arc-menu/history-menu.js';
import '@advanced-rest-client/arc-data-export/arc-data-export.js';
import '../arc-request-workspace.js';

class DemoPage extends ArcDemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'compatibility',
      'outlined',
      'readOnly',
      'narrow',
      'selectedMenu',
      'exportSheetOpened',
      'exportFile',
      'exportData',
      'requestTimeout',
      'sentMessageLimit',
      'oauth2RedirectUri',
      'validateCertificates',
      'followRedirects',
      'ignoreContentOnGet',
      'q'
    ]);
    this._componentName = 'arc-request-workspace';
    this.demoStates = ['Filled', 'Outlined', 'Anypoint'];
    this.selectedMenu = 0;

    this._demoStateHandler = this._demoStateHandler.bind(this);
    this._toggleMainOption = this._toggleMainOption.bind(this);
    this._narrowHandler = this._narrowHandler.bind(this);
    this._requestHandler = this._requestHandler.bind(this);
    this._selectRequest = this._selectRequest.bind(this);
    this._searchKeydown = this._searchKeydown.bind(this);
    this._exportSheetHandler = this._exportSheetHandler.bind(this);
    this._configSwitchHandler = this._configSwitchHandler.bind(this);
    this._configHandler = this._configHandler.bind(this);
    this._tabHandler = this._tabHandler.bind(this);

    this.oauth2RedirectUri = location.href;

    window.addEventListener('transport-request', this._requestHandler);
    window.addEventListener('workspace-state-read', this._restoreHandler.bind(this));
    window.addEventListener('workspace-state-store', this._storeHandler.bind(this));
    window.addEventListener('open-web-url', this._openWebUrlHandler.bind(this));
    window.addEventListener('file-data-save', this._fileExportHandler.bind(this));
    window.addEventListener('google-drive-data-save', this._fileExportHandler.bind(this));
  }

  _toggleMainOption(e) {
    const { name, checked } = e.target;
    this[name] = checked;
  }

  _demoStateHandler(e) {
    const state = e.detail.value;
    this.outlined = state === 1;
    this.compatibility = state === 2;
  }

  _narrowHandler(e) {
    this.narrow = e.detail.value;
  }

  _requestHandler(e) {
    this.sendRequest(e.detail);
  }

  async sendRequest(request) {
    const init = {
      method: request.method,
      headers: this.createHeaders(request.headers)
    };
    if (['GET', 'HEAD'].indexOf(request.method) === -1 && request.payload) {
      init.body = request.payload;
    }
    if (['GET', 'HEAD'].indexOf(request.method) === -1 && request.payload) {
      init.body = request.payload;
    }
    this.rsp = {
      id: request.id,
      request: request,
      response: {},
      isXhr: true,
      loadingTime: 0
    };
    const startTime = Date.now();

    try {
      const response = await fetch(request.url, init);
      this.rsp.loadingTime = Date.now() - startTime;
      let headers = '';
      response.headers.forEach((value, name) => {
        headers += `${name}: ${value}\n`;
      });
      this.rsp.response.headers = headers;
      this.rsp.response.status = response.status;
      this.rsp.response.statusText = response.statusText;
      this.rsp.response.url = response.url;
      const body = await response.text();
      this.rsp.response.payload = body;
      document.body.dispatchEvent(new CustomEvent('report-response', {
        bubbles: true,
        detail: this.rsp
      }));
    } catch (e) {
      this.rsp.isError = true;
      this.rsp.error = e;
      this.rsp.loadingTime = Date.now() - startTime;
      document.body.dispatchEvent(new CustomEvent('report-response', {
        bubbles: true,
        detail: this.rsp
      }));
    }
  }

  createHeaders(data) {
    const headers = new Headers();
    if (data) {
      data.split('\n').forEach((line) => {
        const pair = line.split(':');
        const n = pair[0] ? pair[0].trim() : '';
        if (!n) {
          return;
        }
        const v = pair[1] ? pair[1].trim() : '';
        headers.append(n, v);
      });
    }
    return headers;
  }

  _getStoreItem(name) {
    const str = localStorage.getItem(name);
    let result;
    try {
      result = JSON.parse(str);
    } catch (_) {
      // ..
    }
    return result;
  }

  _restoreHandler(e) {
    e.preventDefault();
    e.detail.result = new Promise((resolve) => {
      const environment = localStorage.getItem('workspace.environment');
      let selected;
      const selStr = localStorage.getItem('workspace.selected');
      if (selStr && !isNaN(selStr)) {
        selected = Number(selStr);
      }

      const version = localStorage.getItem('workspace.version') || undefined;
      const published = localStorage.getItem('workspace.published') || undefined;
      const description = localStorage.getItem('workspace.description') || undefined;
      let provider;
      const providerStr = localStorage.getItem('workspace.provider');
      if (providerStr) {
        try {
          provider = JSON.parse(providerStr);
        } catch (_) {
          // ...
        }
      }
      const config = this._getStoreItem('workspace.config') || {};

      const result = {
        kind: 'ARC#Workspace',
        version,
        published,
        provider,
        description,
        selected,
        environment,
        requests: this._getStoreItem('workspace.requests'),
        config: this._getStoreItem('workspace.config'),
        variables: this._getStoreItem('workspace.variables'),
        webSession: this._getStoreItem('workspace.webSession'),
        auth: this._getStoreItem('workspace.auth')
      };
      if (config) {
        if (config.requestTimeout) {
          this.requestTimeout = Number(config.requestTimeout);
        }
        if (config.sentMessageLimit) {
          this.sentMessageLimit = Number(config.sentMessageLimit);
        }
        if (config.followRedirects) {
          this.followRedirects = Boolean(config.followRedirects);
        }
        if (config.validateCertificates) {
          this.validateCertificates = Boolean(config.validateCertificates);
        }
      }
      setTimeout(() => {
        resolve(result);
      });
    });
  }

  _storeHandler(e) {
    e.preventDefault();
    const {
      environment,
      selected,
      requests,
      config,
      variables,
      webSession,
      auth,
      version,
      published,
      provider,
      description
    } = e.detail.value;
    console.info('Storing workspace data', e.detail.value);
    if (requests) {
      const requestsStr = JSON.stringify(requests);
      localStorage.setItem('workspace.requests', requestsStr);
    }
    if (environment) {
      localStorage.setItem('workspace.environment', environment);
    }
    if (config) {
      const consfigStr = JSON.stringify(config);
      localStorage.setItem('workspace.config', consfigStr);
    }
    if (variables) {
      const variablesStr = JSON.stringify(variables);
      localStorage.setItem('workspace.variables', variablesStr);
    }
    if (webSession) {
      const webSessionStr = JSON.stringify(webSession);
      localStorage.setItem('workspace.webSession', webSessionStr);
    }
    if (auth) {
      const authStr = JSON.stringify(auth);
      localStorage.setItem('workspace.auth', authStr);
    }
    if (version) {
      localStorage.setItem('workspace.version', version);
    }
    if (published) {
      localStorage.setItem('workspace.published', published);
    }
    if (description) {
      localStorage.setItem('workspace.description', description);
    }
    if (provider) {
      localStorage.setItem('workspace.provider', JSON.stringify(provider));
    }
    localStorage.setItem('workspace.selected', selected);
  }

  async generateData() {
    await DataGenerator.insertSavedRequestData({
      requestsSize: 100
    });
    await DataGenerator.insertHistoryRequestData({
      requestsSize: 100
    });
    await DataGenerator.insertCertificatesData();
    document.getElementById('genToast').opened = true;
    document.body.dispatchEvent(new CustomEvent('data-imported', {
      bubbles: true
    }));
  }

  async clearData() {
    await DataGenerator.destroyAll();
    document.getElementById('clearToast').opened = true;
    document.body.dispatchEvent(new CustomEvent('datastore-destroyed', {
      detail: {
        datastore: 'all'
      },
      bubbles: true
    }));
  }

  _selectRequest(e) {
    const workspace = document.querySelector('arc-request-workspace');
    const { base, type, id } = e.detail;
    if (base === 'project') {
      return;
    }
    workspace.addRequestById(type, id);
  }

  //
  // Search saved
  //
  _searchKeydown(e) {
    if (e.code === 'Enter') {
      this._search();
    }
  }

  async _search() {
    if (!this.q) {
      document.querySelector('saved-menu').refresh();
      return;
    }
    const e = new CustomEvent('request-query', {
      cancelable: true,
      bubbles: true,
      detail: {
        type: 'saved',
        q: this.q
      }
    });
    document.body.dispatchEvent(e);
    const items = await e.detail.result
    document.querySelector('saved-menu').requests = items;
  }

  openWebUrlInput() {
    const workspace = document.querySelector('arc-request-workspace');
    workspace.openWebUrlInput();
  };

  _openWebUrlHandler() {
    document.getElementById('webUrlToast').opened = true;
  };

  openMeta() {
    const workspace = document.querySelector('arc-request-workspace');
    workspace.openWorkspaceDetails();
  };

  _fileExportHandler(e) {
    const { content, file } = e.detail;
    setTimeout(() => {
      const data = typeof content === 'string' ? JSON.parse(content) : content;
      this.exportData = JSON.stringify(data, null, 2);
      this.exportFile = file;
      this.exportSheetOpened = true;
    });
    e.preventDefault();
    e.detail.result = Promise.resolve({
      id: 'test-drive-id'
    });
  };

  _exportSheetHandler(e) {
    this.exportSheetOpened = e.detail.value;
  }

  _tabHandler(e) {
    this.selectedMenu = e.detail.value;
  }

  _menuTemplate() {
    const { selectedMenu, listType } = this;
    switch (selectedMenu) {
      case 0: return html`<history-menu
        @navigate="${this._selectRequest}"
        draggableenabled
        .listType="${listType}"
        ></history-menu>`;
      case 1: return this._savedMenuTemplate();
      case 2: return html`<projects-menu
        @navigate="${this._selectRequest}"
        draggableenabled
        .listType="${listType}"></projects-menu>`;
    }
  }

  _savedMenuTemplate() {
    const { q } = this;
    return html`<div>
      <div class="search">
        <anypoint-input
          label="Search"
          class="search"
          nolabelfloat
          name="q"
          .value="${q}"
          @value-changed="${this._configHandler}"
          @keydown="${this._searchKeydown}"
        >
          <label slot="label">Search</label>
          <anypoint-icon-button
            slot="suffix"
            @click="${this._search}"
          >
            <span class="icon">${search}</span>
          </anypoint-icon-button>
        </anypoint-input>
      </div>
      <saved-menu @navigate="${this._selectRequest}" draggableenabled></saved-menu>
    </div>`;
  }

  _demoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      compatibility,
      outlined,
      narrow,
      oauth2RedirectUri,
      selectedMenu,
      requestTimeout,
      sentMessageLimit,
      validateCertificates,
      followRedirects,
      ignoreContentOnGet
    } = this;
    return html`
      <section class="documentation-section">
        <h3>Interactive demo</h3>
        <p>
          This demo lets you preview the REST APIs menu element with various
          configuration options.
        </p>

        <arc-interactive-demo
          .states="${demoStates}"
          @state-chanegd="${this._demoStateHandler}"
          ?dark="${darkThemeActive}"
        >
          <div class="app" slot="content">
            <nav>
              <anypoint-tabs
                ?compatibility="${compatibility}"
                .selected="${selectedMenu}"
                @selected-changed="${this._tabHandler}"
              >
                <anypoint-tab ?compatibility="${compatibility}">History</anypoint-tab>
                <anypoint-tab ?compatibility="${compatibility}">Saved</anypoint-tab>
                <anypoint-tab ?compatibility="${compatibility}">Projects</anypoint-tab>
              </anypoint-tabs>
              ${this._menuTemplate()}
            </nav>
            <arc-request-workspace
              ?compatibility="${compatibility}"
              ?outlined="${outlined}"
              ?narrow="${narrow}"
              .oauth2RedirectUri="${oauth2RedirectUri}"
              .sentMessageLimit="${sentMessageLimit}"
              ?validateCertificates="${validateCertificates}"
              ?ignoreContentOnGet="${ignoreContentOnGet}"
              ?followRedirects="${followRedirects}"
              .requestTimeout="${requestTimeout}"
              draggableenabled
            ></arc-request-workspace>
          </div>

          <label slot="options" id="mainOptionsLabel">Options</label>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="readOnly"
            @change="${this._toggleMainOption}"
          >
            Read only
          </anypoint-checkbox>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="ignoreContentOnGet"
            @change="${this._toggleMainOption}"
          >
            Ignore content-* headers on GET
          </anypoint-checkbox>
        </arc-interactive-demo>
      </section>

      <section class="documentation-section">
        <div class="card">
          <anypoint-button @click="${this.generateData}">Generate data</anypoint-button>
          <anypoint-button @click="${this.clearData}">Clear datastore</anypoint-button>
          <anypoint-button @click="${this.openWebUrlInput}">Open web URL input</anypoint-button>
          <anypoint-button @click="${this.openMeta}">Open details</anypoint-button>
        </div>

        <div class="card">
          <h4>Demo: Variables editor</h4>
          <variables-editor></variables-editor>
        </div>

        ${this._configTemplate()}
        ${this._exportTemplate()}
      </section>


      <paper-toast id="genToast" text="The request data has been generated"></paper-toast>
      <paper-toast id="clearToast" text="The request data has been removed"></paper-toast>
      <paper-toast id="webUrlToast" text="Open web URL requested via event"></paper-toast>
    `;
  }

  _configHandler(e) {
    const { name, value } = e.target;
    this[name] = value;
  }

  _configSwitchHandler(e) {
    const { name, checked } = e.target;
    this[name] = checked;
  }

  _configTemplate() {
    const {
      requestTimeout,
      sentMessageLimit,
      oauth2RedirectUri,
      validateCertificates,
      followRedirects
    } = this;
    return html`<div class="card">
      <h4>Workspace configuration</h4>
      <anypoint-input
        type="number"
        step="1"
        min="0"
        name="requestTimeout"
        .value="${requestTimeout}"
        @value-changed="${this._configHandler}"
      >
        <label slot="label">Request timeout</label>
      </anypoint-input>
      <anypoint-input
        type="number"
        step="1"
        min="0"
        name="sentMessageLimit"
        .value="${sentMessageLimit}"
        @value-changed="${this._configHandler}"
      >
        <label slot="label">Sent message preview bytes limit</label>
      </anypoint-input>
      <anypoint-switch
        nmae="validateCertificates"
        .checked="${validateCertificates}"
        @change="${this._configSwitchHandler}"
      >
        Validate certificates
      </anypoint-switch>
      <anypoint-switch
        @name="followRedirects"
        .checked="${followRedirects}"
        @change="${this._configSwitchHandler}"
      >
        Follow redirects
      </anypoint-switch>
      <anypoint-input
        type="url"
        name="oauth2RedirectUri"
        .value="${oauth2RedirectUri}"
        @value-changed="${this._configHandler}"
      >
        <label slot="label">OAuth2 redirect URI</label>
      </anypoint-input>
    </div>`;
  }

  _exportTemplate() {
    const {
      exportSheetOpened,
      exportFile,
      exportData
    } = this;
    return html`<bottom-sheet
      .opened="${exportSheetOpened}"
      @opened-changed="${this._exportSheetHandler}">
      <h3>Export demo</h3>
      <p>This is a preview of the file. Normally export module would save this data to file / Drive.</p>
      <p>File: ${exportFile}</p>
      <pre>${exportData}</pre>
    </bottom-sheet>`;
  }

  contentTemplate() {
    return html`
      <variables-model></variables-model>
      <url-history-model></url-history-model>
      <variables-manager></variables-manager>
      <project-model></project-model>
      <request-model></request-model>
      <url-indexer></url-indexer>
      <client-certificate-model></client-certificate-model>
      <variables-evaluator id="eval" no-before-request=""></variables-evaluator>
      <oauth2-authorization></oauth2-authorization>
      <oauth1-authorization></oauth1-authorization>
      <arc-request-logic></arc-request-logic>
      <request-hooks-logic></request-hooks-logic>
      <arc-data-export appversion="demo-page"></arc-data-export>

      <h2>Requests workspace</h2>
      ${this._demoTemplate()}
    `;
  }
}

const instance = new DemoPage();
instance.render();
window._demo = instance;
