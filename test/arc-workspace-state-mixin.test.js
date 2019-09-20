import { fixture, assert, html, aTimeout } from '@open-wc/testing';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import '@advanced-rest-client/arc-models/project-model.js';
import '@advanced-rest-client/arc-models/request-model.js';
import '@advanced-rest-client/arc-models/variables-model.js';
import { DataGenerator } from '@advanced-rest-client/arc-data-generator/arc-data-generator.js';
import '../arc-request-workspace.js';

describe('ArcWorkspaceStateMixin', function() {
  async function basicFixture() {
    const area = await fixture(html`
    <div>
      <project-model></project-model>
      <request-model></request-model>
      <variables-model></variables-model>
      <arc-request-workspace noautoprojects noautorestore></arc-request-workspace>
    </div>
    `);
    return area.querySelector('arc-request-workspace');
  }

  describe('_dispatchWorkspaceState()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Dispatches workspace-state-read event', () => {
      const spy = sinon.spy();
      element.addEventListener('workspace-state-read', spy);
      element._dispatchWorkspaceState();
      assert.isTrue(spy.called);
    });

    it('Returns the event', () => {
      const e = element._dispatchWorkspaceState();
      assert.typeOf(e, 'customevent');
    });

    it('Event has type on detail', () => {
      const e = element._dispatchWorkspaceState();
      assert.equal(e.detail.type, 'workspace-state');
    });
  });

  describe('_restoreModelError()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Calls addEmptyRequest()', () => {
      const spy = sinon.spy(element, 'addEmptyRequest');
      element._restoreModelError();
      assert.isTrue(spy.called);
    });

    it('Sets restoring flag to false', () => {
      element._restoring = (true);
      element._restoreModelError();
      assert.isFalse(element.restoring);
    });

    it('Sets initialized flag to true', () => {
      element._initialized = (false);
      element._restoreModelError();
      assert.isTrue(element.initialized);
    });
  });

  describe('_restoreMeta()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Sets version', () => {
      const version = '0.1.0';
      element._restoreMeta({ version });
      assert.equal(element.version, version);
    });

    it('Sets published', () => {
      const published = '2019-04-20T17:56:36.726Z';
      element._restoreMeta({ published });
      assert.equal(element.published, published);
    });

    it('Sets description', () => {
      const description = 'Test description';
      element._restoreMeta({ description });
      assert.equal(element.description, description);
    });

    it('Sets provider.url', () => {
      const provider = { url: 'https://domain.com' };
      element._restoreMeta({ provider });
      assert.equal(element.provider.url, provider.url);
    });

    it('Sets provider.name', () => {
      const provider = { name: 'First Last' };
      element._restoreMeta({ provider });
      assert.equal(element.provider.name, provider.name);
    });

    it('Sets provider.email', () => {
      const provider = { email: 'test@domain.com' };
      element._restoreMeta({ provider });
      assert.equal(element.provider.email, provider.email);
    });
  });

  describe('_restoreRequests()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Calls addEmptyRequest() when no requests', () => {
      const spy = sinon.spy(element, 'addEmptyRequest');
      element._restoreRequests();
      assert.isTrue(spy.called);
    });

    it('Calls addEmptyRequest() when requests array empty', () => {
      const spy = sinon.spy(element, 'addEmptyRequest');
      element._restoreRequests([]);
      assert.isTrue(spy.called);
    });

    it('Calls refreshTabs() when not requests', () => {
      const spy = sinon.spy(element, 'refreshTabs');
      element._restoreRequests();
      assert.isTrue(spy.called);
    });

    it('Calls appendRequest() for each request in the array', () => {
      const requests = DataGenerator.generateRequests({
        requestsSize: 2
      });
      const spy = sinon.spy(element, 'appendRequest');
      element._restoreRequests(requests);
      assert.equal(spy.callCount, 2);
    });

    it('Calls refreshTabs() when adding requests', () => {
      const requests = DataGenerator.generateRequests({
        requestsSize: 2
      });
      const spy = sinon.spy(element, 'refreshTabs');
      element._restoreRequests(requests);
      assert.isTrue(spy.called);
    });

    it('Generates _id when missing', () => {
      const requests = DataGenerator.generateRequests({
        requestsSize: 2
      });
      requests.forEach((i) => {
        delete i._id;
      });
      element._restoreRequests(requests);
      requests.forEach((i) => {
        assert.typeOf(i._id, 'string');
      });
    });
  });

  describe('_restoreSelected()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Set selection to passed number', () => {
      element._restoreSelected(2);
      assert.equal(element.selected, 2);
    });

    it('Set selection to passed number when argument is a string', () => {
      element._restoreSelected('2');
      assert.equal(element.selected, 2);
    });

    it('Selects latest request when argument is not a number', () => {
      element.activeRequests = [{}, {}];
      element._restoreSelected();
      assert.equal(element.selected, 1);
    });
  });

  describe('_restoreEnvironment()', () => {
    let element;
    const env = 'not-default';
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Set environment property', () => {
      element._restoreEnvironment(env);
      assert.equal(element.environment, env);
    });

    it('Calls _dispatch() with arguments', () => {
      const spy = sinon.spy(element, '_dispatch');
      element._restoreEnvironment(env);
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][0], 'selected-environment-changed', 'Event type is set');
      assert.equal(spy.args[0][1].value, env, 'detail.value is set');
    });

    it('Does nothing when environment is not set', () => {
      element._restoreEnvironment();
      assert.isUndefined(element.environment);
    });
  });

  describe('_restoreVariables()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Set variables property', () => {
      const vars = [{ variable: 'test' }];
      element._restoreVariables(vars);
      assert.deepEqual(element.variables, vars);
    });

    it('Does nothing when variables is not set', () => {
      element._restoreVariables();
      assert.isUndefined(element.variables);
    });
  });

  describe('_restoreConfiguration()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Does nothing when variables is not set', () => {
      element._restoreConfiguration();
      assert.isUndefined(element.requestTimeout);
      assert.isUndefined(element.validateCertificates);
      assert.isUndefined(element.followRedirects);
      assert.isUndefined(element.sentMessageLimit);
    });

    it('Set requestTimeout property', () => {
      const config = { requestTimeout: 20 };
      element._restoreConfiguration(config);
      assert.equal(element.requestTimeout, 20);
    });

    it('Set requestTimeout property when value is string', () => {
      const config = { requestTimeout: '20' };
      element._restoreConfiguration(config);
      assert.equal(element.requestTimeout, 20);
    });

    it('Set sentMessageLimit property', () => {
      const config = { sentMessageLimit: 20 };
      element._restoreConfiguration(config);
      assert.equal(element.sentMessageLimit, 20);
    });

    it('Set sentMessageLimit property when value is string', () => {
      const config = { sentMessageLimit: '20' };
      element._restoreConfiguration(config);
      assert.equal(element.sentMessageLimit, 20);
    });

    [
      'validateCertificates', 'followRedirects', 'workspaceReadOnly',
      'variablesDisabled', 'nativeTransport'
    ]
    .forEach((prop) => {
      it(`Set ${prop} when true`, () => {
        const config = {};
        config[prop] = true;
        element._restoreConfiguration(config);
        assert.isTrue(element[prop]);
      });

      it(`Set ${prop} when false`, () => {
        const config = {};
        config[prop] = false;
        element._restoreConfiguration(config);
        assert.isFalse(element[prop]);
      });
    });
  });

  describe('_restoreWebSessionConfiguration()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Does nothing when values are not set', () => {
      element._restoreWebSessionConfiguration();
      assert.isUndefined(element.webSessionUrl);
    });

    it('Set webSessionUrl property', () => {
      const config = { webSessionUrl: 'https://' };
      element._restoreWebSessionConfiguration(config);
      assert.equal(element.webSessionUrl, 'https://');
    });

    it('Ignores unknown type for webSessionUrl', () => {
      const config = { webSessionUrl: true };
      element._restoreWebSessionConfiguration(config);
      assert.isUndefined(element.webSessionUrl);
    });
  });

  describe('_restoreAuthConfiguration()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Does nothing when values are not set', () => {
      element._restoreAuthConfiguration();
      assert.isUndefined(element._workspaceOauth2RedirectUri);
    });

    it('Set webSessionUrl property', () => {
      const config = { oauth2RedirectUri: 'https://' };
      element._restoreAuthConfiguration(config);
      assert.equal(element._workspaceOauth2RedirectUri, 'https://');
    });

    it('Ignores unknown type for webSessionUrl', () => {
      const config = { oauth2RedirectUri: true };
      element._restoreAuthConfiguration(config);
      assert.isUndefined(element._workspaceOauth2RedirectUri);
    });
  });

  describe('_afterRestore()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Forces selection change', async () => {
      element.selected = 1;
      const spy = sinon.spy(element, '_selectedChanged');
      element._afterRestore();
      await aTimeout();
      assert.equal(spy.callCount, 1);
    });

    it('Sets restoring flag to false', async () => {
      element._restoring = (true);
      element._afterRestore();
      await aTimeout();
      assert.isFalse(element.restoring);
    });

    it('Sets initialized flag to true', async () => {
      element._initialized = (false);
      element._afterRestore();
      await aTimeout();
      assert.isTrue(element.initialized);
    });
  });

  describe('_restore()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Calls addEmptyRequest() when no state', () => {
      const spy = sinon.spy(element, 'addEmptyRequest');
      element._restore();
      assert.isTrue(spy.called);
    });

    it('Won\'t call _restoreRequests() when no state', () => {
      const spy = sinon.spy(element, '_restoreRequests');
      element._restore();
      assert.isFalse(spy.called);
    });

    it('Calls _restoreRequests()', () => {
      const spy = sinon.spy(element, '_restoreRequests');
      const requests = DataGenerator.generateRequests({
        requestsSize: 2
      });
      element._restore({
        requests
      });
      assert.isTrue(spy.called);
      assert.deepEqual(spy.args[0][0], requests);
    });

    it('Calls _restoreMeta()', () => {
      const spy = sinon.spy(element, '_restoreMeta');
      const cnf = {
        version: '0.0.1'
      };
      element._restore(cnf);
      assert.isTrue(spy.called);
      assert.deepEqual(spy.args[0][0], cnf);
    });

    it('Calls _restoreSelected()', () => {
      const spy = sinon.spy(element, '_restoreSelected');
      element._restore({
        selected: 1
      });
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][0], 1);
    });

    it('Calls _restoreEnvironment()', () => {
      const env = 'other-env';
      const spy = sinon.spy(element, '_restoreEnvironment');
      element._restore({
        environment: env
      });
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][0], env);
    });

    it('Calls _restoreVariables()', () => {
      const vars = [{ variable: 'test' }];
      const spy = sinon.spy(element, '_restoreVariables');
      element._restore({
        variables: vars
      });
      assert.isTrue(spy.called);
      assert.deepEqual(spy.args[0][0], vars);
    });

    it('Calls _restoreConfiguration()', () => {
      const config = { followRedirects: true };
      const spy = sinon.spy(element, '_restoreConfiguration');
      element._restore({
        config
      });
      assert.isTrue(spy.called);
      assert.deepEqual(spy.args[0][0], config);
    });

    it('Calls _restoreWebSessionConfiguration()', () => {
      const webSession = { webSessionUrl: 'https://' };
      const spy = sinon.spy(element, '_restoreWebSessionConfiguration');
      element._restore({
        webSession
      });
      assert.isTrue(spy.called);
      assert.deepEqual(spy.args[0][0], webSession);
    });

    it('Calls _restoreAuthConfiguration()', () => {
      const auth = { oauth2RedirectUri: 'https://' };
      const spy = sinon.spy(element, '_restoreAuthConfiguration');
      element._restore({
        auth
      });
      assert.isTrue(spy.called);
      assert.deepEqual(spy.args[0][0], auth);
    });
  });

  describe('restoreWorkspace()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    function dataFactory(e) {
      e.preventDefault();
      e.detail.result = new Promise((resolve) => {
        const requests = DataGenerator.generateRequests({
          requestsSize: 2
        });

        resolve({
          requests,
          selected: 1,
          environment: 'other-env'
        });
      });
    }

    function noopFactory(e) {
      e.preventDefault();
      e.detail.result = Promise.resolve({});
    }

    function errorFactory(e) {
      e.preventDefault();
      e.detail.result = Promise.reject(new Error('test'));
    }

    it('Clears activeRequests when set', async () => {
      element.activeRequests = DataGenerator.generateRequests({
        requestsSize: 2
      });
      element.addEventListener('workspace-state-read', noopFactory);
      element.restoreWorkspace();
      element.removeEventListener('workspace-state-read', noopFactory);
      assert.deepEqual(element.activeRequests, []);
      await aTimeout();
    });

    it('Sets restoring to true', async () => {
      element.addEventListener('workspace-state-read', noopFactory);
      element.restoreWorkspace();
      element.removeEventListener('workspace-state-read', noopFactory);
      assert.isTrue(element.restoring);
      await aTimeout();
    });

    it('Calls _dispatchWorkspaceState()', async () => {
      const spy = sinon.spy(element, '_dispatchWorkspaceState');
      element.addEventListener('workspace-state-read', noopFactory);
      element.restoreWorkspace();
      element.removeEventListener('workspace-state-read', noopFactory);
      assert.isTrue(spy.called);
      await aTimeout();
    });

    it('Calls _restoreModelError() when no model', async () => {
      const spy = sinon.spy(element, '_restoreModelError');
      element.restoreWorkspace()
      .catch(() => {});
      assert.isTrue(spy.called);
      await aTimeout();
    });

    it('Restores defaults when no state', async () => {
      element.addEventListener('workspace-state-read', noopFactory);
      await element.restoreWorkspace();
      await aTimeout();
      element.removeEventListener('workspace-state-read', noopFactory);
      assert.lengthOf(element.activeRequests, 1);
      assert.equal(element.selected, 0);
      assert.isUndefined(element.environment);
    });

    it('Restores state', async () => {
      element.addEventListener('workspace-state-read', dataFactory);
      await element.restoreWorkspace();
      element.removeEventListener('workspace-state-read', dataFactory);
      await aTimeout();
      assert.lengthOf(element.activeRequests, 2);
      assert.equal(element.selected, 1);
      assert.equal(element.environment, 'other-env');
    });

    it('Handles restoration errors', async () => {
      element.addEventListener('workspace-state-read', errorFactory);
      element.restoreWorkspace()
      await aTimeout();
      element.removeEventListener('workspace-state-read', errorFactory);
      assert.lengthOf(element.activeRequests, 1);
      assert.equal(element.selected, 0);
      assert.isUndefined(element.environment);
    });
  });

  describe('serializeConfig()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Returns object', () => {
      const result = element.serializeConfig();
      assert.typeOf(result, 'object');
    });

    it('Sets requestTimeout when a number', () => {
      element.requestTimeout = 20;
      const result = element.serializeConfig();
      assert.equal(result.requestTimeout, 20);
    });

    it('Skips requestTimeout when not a number', () => {
      element.requestTimeout = 'test';
      const result = element.serializeConfig();
      assert.isUndefined(result.requestTimeout);
    });

    it('Sets sentMessageLimit when a number', () => {
      element.sentMessageLimit = 20;
      const result = element.serializeConfig();
      assert.equal(result.sentMessageLimit, 20);
    });

    it('Skips sentMessageLimit when not a number', () => {
      element.sentMessageLimit = 'test';
      const result = element.serializeConfig();
      assert.isUndefined(result.sentMessageLimit);
    });

    [
      'followRedirects', 'validateCertificates', 'workspaceReadOnly',
      'variablesDisabled', 'nativeTransport'
    ].forEach((prop) => {
      it(`Sets ${prop} when false`, () => {
        element[prop] = false;
        const result = element.serializeConfig();
        assert.isFalse(result[prop]);
      });

      it(`Sets ${prop} when true`, () => {
        element[prop] = true;
        const result = element.serializeConfig();
        assert.isTrue(result[prop]);
      });

      it(`Skips ${prop} when not a boolean`, () => {
        element[prop] = 'test';
        const result = element.serializeConfig();
        assert.isUndefined(result.validateCertificates);
      });
    });
  });

  describe('serializeWebSession()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Returns object', () => {
      const result = element.serializeWebSession();
      assert.typeOf(result, 'object');
    });

    it('Sets webSessionUrl when a string', () => {
      element.webSessionUrl = 'https://';
      const result = element.serializeWebSession();
      assert.equal(result.webSessionUrl, 'https://');
    });

    it('Skips webSessionUrl when not a string', () => {
      element.webSessionUrl = true;
      const result = element.serializeWebSession();
      assert.isUndefined(result.webSessionUrl);
    });
  });

  describe('serializeAuthorization()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Returns object', () => {
      const result = element.serializeAuthorization();
      assert.typeOf(result, 'object');
    });

    it('Sets oauth2RedirectUri when a string', () => {
      element._workspaceOauth2RedirectUri = 'https://';
      const result = element.serializeAuthorization();
      assert.equal(result.oauth2RedirectUri, 'https://');
    });

    it('Skips oauth2RedirectUri when not a string', () => {
      element._workspaceOauth2RedirectUri = true;
      const result = element.serializeAuthorization();
      assert.isUndefined(result.oauth2RedirectUri);
    });
  });

  describe('serializeWorkspace()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Returns object', () => {
      const result = element.serializeWorkspace();
      assert.typeOf(result, 'object');
    });

    it('Sets kind property', () => {
      const result = element.serializeWorkspace();
      assert.equal(result.kind, 'ARC#Workspace');
    });

    it('Sets version property', () => {
      element.version = 'test-ver';
      const result = element.serializeWorkspace();
      assert.equal(result.version, 'test-ver');
    });

    it('Sets published property', () => {
      const published = '2019-04-20T17:56:36.726Z';
      element.published = published;
      const result = element.serializeWorkspace();
      assert.equal(result.published, published);
    });

    it('Sets description property', () => {
      const description = 'Test description';
      element.description = description;
      const result = element.serializeWorkspace();
      assert.equal(result.description, description);
    });

    it('Sets provider property', () => {
      const provider = { email: 'test@domain.com' };
      element.provider = provider;
      const result = element.serializeWorkspace();
      assert.typeOf(result.provider, 'object');
    });

    it('Sets provider.email property', () => {
      const provider = { email: 'test@domain.com' };
      element.provider = provider;
      const result = element.serializeWorkspace();
      assert.equal(result.provider.email, provider.email);
    });

    it('Sets provider.url property', () => {
      const provider = { url: 'https://domain.com' };
      element.provider = provider;
      const result = element.serializeWorkspace();
      assert.equal(result.provider.url, provider.url);
    });

    it('Sets provider.name property', () => {
      const provider = { name: 'Pawel Psztyc' };
      element.provider = provider;
      const result = element.serializeWorkspace();
      assert.equal(result.provider.name, provider.name);
    });

    it('Sets default environment', () => {
      const result = element.serializeWorkspace();
      assert.equal(result.environment, 'default');
    });

    it('Sets default selected', () => {
      const result = element.serializeWorkspace();
      assert.equal(result.selected, 0);
    });

    it('Sets default requests', () => {
      const old = element.activeRequests;
      element.activeRequests = undefined;
      const result = element.serializeWorkspace();
      element.activeRequests = old;
      assert.deepEqual(result.requests, []);
    });

    it('Sets environment', () => {
      element.environment = 'other-env';
      const result = element.serializeWorkspace();
      assert.equal(result.environment, 'other-env');
    });

    it('Sets default selected', () => {
      element.selected = 3;
      const result = element.serializeWorkspace();
      assert.equal(result.selected, 3);
    });

    it('Sets requests', () => {
      element.activeRequests = DataGenerator.generateRequests({
        requestsSize: 2
      });
      const result = element.serializeWorkspace();
      assert.deepEqual(result.requests, element.activeRequests);
    });

    it('Calls serializeConfig()', () => {
      const spy = sinon.spy(element, 'serializeConfig');
      element.serializeWorkspace();
      assert.isTrue(spy.called);
    });

    it('Sets config', () => {
      element.followRedirects = true;
      const result = element.serializeWorkspace();
      assert.deepEqual(result.config, { followRedirects: true });
    });

    it('Sets variables', () => {
      const vars = [{ variable: 'test' }];
      element.variables = vars;
      const result = element.serializeWorkspace();
      assert.deepEqual(result.variables, vars);
    });

    it('Calls serializeWebSession()', () => {
      const spy = sinon.spy(element, 'serializeWebSession');
      element.serializeWorkspace();
      assert.isTrue(spy.called);
    });

    it('Calls serializeAuthorization()', () => {
      const spy = sinon.spy(element, 'serializeAuthorization');
      element.serializeWorkspace();
      assert.isTrue(spy.called);
    });

    it('Sets webSession', () => {
      element.webSessionUrl = 'https://';
      const result = element.serializeWorkspace();
      assert.deepEqual(result.webSession, { webSessionUrl: 'https://' });
    });
  });

  describe('__dispatchStoreWorkspace()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Calls serializeWorkspace()', () => {
      const spy = sinon.spy(element, 'serializeWorkspace');
      element.__dispatchStoreWorkspace();
      assert.isTrue(spy.called);
    });

    it('Clears __storingTimeout', () => {
      element.__storingTimeout = 1234;
      element.__dispatchStoreWorkspace();
      assert.isUndefined(element.__storingTimeout);
    });

    it('Calls _dispatch() with arguments', () => {
      const spy = sinon.spy(element, '_dispatch');
      element.__dispatchStoreWorkspace();
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][0], 'workspace-state-store', 'Event type is set');
      const compare = element.serializeWorkspace();
      assert.deepEqual(spy.args[0][1].value, compare, 'Detail is set');
    });

    it('Dispatches workspace-state-store event', () => {
      let detail;
      element.addEventListener('workspace-state-store', function f(e) {
        element.removeEventListener('workspace-state-store', f);
        e.preventDefault();
        detail = e.detail;
      });
      element.__dispatchStoreWorkspace();
      assert.typeOf(detail, 'object');
      const compare = element.serializeWorkspace();
      assert.deepEqual(detail.value, compare, 'Detail is set');
    });
  });

  describe('_notifyStoreWorkspace()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element._initialized = (true);
    });

    it('Does nothing when not initialized', () => {
      element._initialized = (false);
      const spy = sinon.spy(element, 'serializeWorkspace');
      element._notifyStoreWorkspace();
      assert.isFalse(spy.called);
    });

    it('Does nothing when restoring', () => {
      element._restoring = (true);
      const spy = sinon.spy(element, 'serializeWorkspace');
      element._notifyStoreWorkspace();
      assert.isFalse(spy.called);
    });

    it('Does nothing when workspaceReadOnly', () => {
      element.workspaceReadOnly = true;
      const spy = sinon.spy(element, 'serializeWorkspace');
      element._notifyStoreWorkspace();
      assert.isFalse(spy.called);
    });

    it('Will not call _clearStoreTimeout() when __storingTimeout is not set', () => {
      const spy = sinon.spy(element, '_clearStoreTimeout');
      element._notifyStoreWorkspace();
      assert.isFalse(spy.called);
    });

    it('Calls _clearStoreTimeout() when __storingTimeout is set', () => {
      element.__storingTimeout = 123;
      const spy = sinon.spy(element, '_clearStoreTimeout');
      element._notifyStoreWorkspace();
      assert.isTrue(spy.called);
    });

    it('Sets __storingTimeout property', () => {
      element._notifyStoreWorkspace();
      assert.typeOf(element.__storingTimeout, 'number');
    });

    it('Ewentually calls __dispatchStoreWorkspace()', (done) => {
      element._notifyStoreWorkspace();
      const spy = sinon.spy(element, '__dispatchStoreWorkspace');
      setTimeout(() => {
        assert.isTrue(spy.called);
        done();
      }, 1000);
    });

    it('Uses requestAnimationFrame() as fallback', (done) => {
      const old = window.requestIdleCallback;
      window.requestIdleCallback = undefined;
      const spy = sinon.spy(window, 'requestAnimationFrame');
      element._notifyStoreWorkspace();
      setTimeout(() => {
        window.requestIdleCallback = old;
        assert.isTrue(spy.called);
        done();
      });
    });
  });

  describe('_clearStoreTimeout()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Calls cancelIdleCallback()', () => {
      if (!window.cancelIdleCallback) {
        return;
      }
      const spy = sinon.spy(window, 'cancelIdleCallback');
      element.__storingTimeout = 123;
      element._clearStoreTimeout();
      window.cancelIdleCallback.restore();
      assert.isTrue(spy.called);
    });

    it('Uses cancelAnimationFrame() as fallback', () => {
      const old = window.cancelIdleCallback;
      window.cancelIdleCallback = undefined;
      const spy = sinon.spy(window, 'cancelAnimationFrame');
      element.__storingTimeout = 123;
      element._clearStoreTimeout();
      window.cancelIdleCallback = old;
      window.cancelAnimationFrame.restore();
      assert.isTrue(spy.called);
    });

    it('Clears __storingTimeout', () => {
      element.__storingTimeout = 123;
      element._clearStoreTimeout();
      assert.isUndefined(element.__storingTimeout);
    });
  });

  describe('_workspaceConfigChanged()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Calls _notifyStoreWorkspace()', () => {
      const spy = sinon.spy(element, '_notifyStoreWorkspace');
      element._workspaceConfigChanged();
      assert.isTrue(spy.called);
    });

    it('Won\'t call _notifyStoreWorkspace() when restoring', () => {
      element._restoring = (true);
      const spy = sinon.spy(element, '_notifyStoreWorkspace');
      element._workspaceConfigChanged();
      assert.isFalse(spy.called);
    });

    it('Called when "environment" changes', async () => {
      const spy = sinon.spy(element, '_notifyStoreWorkspace');
      element.environment = 'test';
      await aTimeout();
      assert.isTrue(spy.called);
    });

    it('Called when "requestTimeout" changes', async () => {
      const spy = sinon.spy(element, '_notifyStoreWorkspace');
      element.requestTimeout = 100;
      await aTimeout();
      assert.isTrue(spy.called);
    });

    it('Called when "validateCertificates" changes', async () => {
      const spy = sinon.spy(element, '_notifyStoreWorkspace');
      element.validateCertificates = true;
      await aTimeout();
      assert.isTrue(spy.called);
    });

    it('Called when "followRedirects" changes', async () => {
      const spy = sinon.spy(element, '_notifyStoreWorkspace');
      element.followRedirects = true;
      await aTimeout();
      assert.isTrue(spy.called);
    });

    it('Called when "sentMessageLimit" changes', async () => {
      const spy = sinon.spy(element, '_notifyStoreWorkspace');
      element.sentMessageLimit = 100;
      await aTimeout();
      assert.isTrue(spy.called);
    });

    it('Called when "webSessionUrl" changes', async () => {
      const spy = sinon.spy(element, '_notifyStoreWorkspace');
      element.webSessionUrl = 'https://';
      await aTimeout();
      assert.isTrue(spy.called);
    });
  });

  describe('_workspaceReadOnlyChanged()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Calls __dispatchStoreWorkspace()', async () => {
      const spy = sinon.spy(element, '__dispatchStoreWorkspace');
      element._workspaceReadOnlyChanged();
      await aTimeout();
      assert.isTrue(spy.called);
    });

    it('Called when "workspaceReadOnly" changes', async () => {
      const spy = sinon.spy(element, '__dispatchStoreWorkspace');
      element.workspaceReadOnly = false;
      await aTimeout();
      assert.isTrue(spy.called);
    });
  });
});
