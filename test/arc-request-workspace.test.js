import { fixture, assert, html, nextFrame } from '@open-wc/testing';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import { DataGenerator } from '@advanced-rest-client/arc-data-generator/arc-data-generator.js';
import '@advanced-rest-client/arc-models/project-model.js';
import '@advanced-rest-client/arc-models/request-model.js';
import '@advanced-rest-client/arc-models/variables-model.js';
import { WorkspaceTestHelper } from './workspace-test-helper.js';
import '../arc-request-workspace.js';

describe('<arc-request-workspace>', function() {
  async function basicFixture() {
    const area = await fixture(html`
    <div>
      <project-model></project-model>
      <request-model></request-model>
      <variables-model></variables-model>
      <arc-request-workspace noautoprojects></arc-request-workspace>
    </div>
    `);
    return area.querySelector('arc-request-workspace');
  }

  async function noAutoFixture() {
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

  async function exportEncryptFixture() {
    const area = await fixture(html`
    <div>
      <project-model></project-model>
      <request-model></request-model>
      <variables-model></variables-model>
      <arc-request-workspace noautoprojects noautorestore withEncrypt></arc-request-workspace>
    </div>
    `);
    return area.querySelector('arc-request-workspace');
  }

  describe('Basics', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      WorkspaceTestHelper.wrapStateReadEvent(element);
    });

    it('selected is eventually set', (done) => {
      element.addEventListener('selected-changed', function f() {
        element.removeEventListener('selected-changed', f);
        done();
      });
    });

    it('activeRequests has default value', () => {
      assert.typeOf(element.activeRequests, 'array');
      assert.lengthOf(element.activeRequests, 0);
    });

    it('restoring is not set when initializing', () => {
      assert.isUndefined(element.restoring);
    });
  });

  describe('_dispatch()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
    });
    const eName = 'test-event';
    const eDetail = 'test-detail';
    it('Dispatches an event', () => {
      const spy = sinon.spy();
      element.addEventListener(eName, spy);
      element._dispatch(eName);
      assert.isTrue(spy.called);
    });
    it('Returns the event', () => {
      const e = element._dispatch(eName);
      assert.typeOf(e, 'customevent');
    });
    it('Event is cancelable by default', () => {
      const e = element._dispatch(eName);
      assert.isTrue(e.cancelable);
    });
    it('Event is composed', () => {
      const e = element._dispatch(eName);
      if (typeof e.composed !== 'undefined') {
        assert.isTrue(e.composed);
      }
    });
    it('Event bubbles', () => {
      const e = element._dispatch(eName);
      assert.isTrue(e.bubbles);
    });
    it('Event is not cancelable when set', () => {
      const e = element._dispatch(eName, eDetail, false);
      assert.isFalse(e.cancelable);
    });
    it('Event has detail', () => {
      const e = element._dispatch(eName, eDetail);
      assert.equal(e.detail, eDetail);
    });
  });

  describe('_computeTabName()', () => {
    function restoreHandler(e) {
      e.preventDefault();
      e.detail.result = new Promise((resolve) => {
        const saved = DataGenerator.generateSavedRequestData({
          requestsSize: 3
        });
        const history = DataGenerator.generateHistoryRequestsData({
          requestsSize: 3
        });
        const requests = history.concat(saved.requests);
        const result = {
          selected: 1,
          environment: 'test-env',
          requests
        };
        resolve(result);
      });
    }
    let element;
    before(async () => {
      window.addEventListener('workspace-state-read', restoreHandler);
      element = await basicFixture();
    });

    after(() => {
      window.removeEventListener('workspace-state-read', restoreHandler);
    });

    it('Returns "New request" for undefined item', () => {
      const result = element._computeTabName();
      assert.equal(result, 'New request');
    });

    it('Returns item name if exists', () => {
      const result = element._computeTabName('test-name');
      assert.equal(result, 'test-name');
    });

    it('Returns URL if item name does not exists', () => {
      const result = element._computeTabName(undefined, 'test-url');
      assert.equal(result, 'test-url');
    });

    it('Returns "New request" otherwise', () => {
      const result = element._computeTabName('', '');
      assert.equal(result, 'New request');
    });
  });

  describe('appendRequest()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
    });

    it('Adds empty request to the list of active requests', () => {
      element.appendRequest({ method: 'x-test' });
      assert.lengthOf(element.activeRequests, 1);
    });

    it('Added request has an id', () => {
      element.appendRequest({ method: 'x-test' });
      assert.typeOf(element.activeRequests[0]._id, 'string');
    });

    it('Eventually sets request data', () => {
      element.appendRequest({ method: 'x-test' });
      assert.equal(element.activeRequests[0].method, 'x-test');
    });

    it('Selects newly added request', () => {
      element.appendRequest({});
      assert.equal(element.selected, 0);
    });

    it('Returns index of created request', () => {
      const result = element.appendRequest({});
      assert.equal(result, 0);
    });

    it('Won\'t set ID if already exists', () => {
      const request = {
        _id: 'test-id',
        url: 'http:api.domain.com'
      };
      element.appendRequest(request);
      assert.deepEqual(element.activeRequests[0], request);
    });

    it('Won\'t add second empty request', () => {
      element.appendRequest({});
      element.appendRequest({});
      assert.lengthOf(element.activeRequests, 1);
    });

    it('Adds two empty requests when skipPositionCheck is set', () => {
      element.appendRequest({});
      element.appendRequest({}, { skipPositionCheck: true });
      assert.lengthOf(element.activeRequests, 2);
    });

    it('Won\'t select added request when noAutoSelect is set', () => {
      element.appendRequest({});
      element.appendRequest({}, { noAutoSelect: true });
      assert.equal(element.selected, 0);
    });
  });

  describe('addEmptyRequest()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
    });

    it('Adds request to the list of active requests', () => {
      element.addEmptyRequest();
      assert.lengthOf(element.activeRequests, 1);
      const r = element.activeRequests[0];
      assert.equal(r.method, 'GET');
      assert.equal(r.url, 'http://');
    });

    it('Selects newly added request', () => {
      element.addEmptyRequest();
      assert.equal(element.selected, 0);
    });
  });

  describe('updateRequestObject()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
      WorkspaceTestHelper.addRequests(element);
      await nextFrame();
    });

    it('Adds _id to the request', () => {
      const request = DataGenerator.generateSavedItem();
      delete request._id;
      element.updateRequestObject(request, 0);
      assert.typeOf(request._id, 'string');
    });

    it('Calls __updatePanelRequest()', () => {
      const spy = sinon.spy(element, '__updatePanelRequest');
      const request = DataGenerator.generateSavedItem();
      element.updateRequestObject(request, 1);
      assert.isTrue(spy.called);
    });

    it('Updates panel id', () => {
      const request = DataGenerator.generateSavedItem();
      element.updateRequestObject(request, 0);
      const node = element.shadowRoot.querySelector(`request-panel[data-id="${request._id}"]`);
      assert.ok(node);
    });

    it('Sets active request', () => {
      const request = DataGenerator.generateSavedItem();
      element.updateRequestObject(request, 0);
      assert.deepEqual(element.activeRequests[0], request);
    });

    it('Does nothing when no active request for the index', () => {
      const spy = sinon.spy(element, '__updatePanelRequest');
      const request = DataGenerator.generateSavedItem();
      element.updateRequestObject(request, 10);
      assert.isFalse(spy.called);
    });
  });

  describe('_closeRequest()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
      WorkspaceTestHelper.addRequests(element);
      await nextFrame();
    });

    it('Closes request after button click', () => {
      const spy = sinon.spy(element, 'removeRequest');
      const button = element.shadowRoot.querySelectorAll('.close-icon')[1];
      MockInteractions.tap(button);
      assert.isTrue(spy.called);
    });

    it('Closes second request', () => {
      const spy = sinon.spy(element, 'removeRequest');
      const button = element.shadowRoot.querySelectorAll('.close-icon')[1];
      MockInteractions.tap(button);
      assert.equal(spy.args[0][0], 1);
    });

    it('Does nothing when event target has no data-index', () => {
      const spy = sinon.spy(element, 'removeRequest');
      const button = element.shadowRoot.querySelectorAll('.close-icon')[1];
      button.removeAttribute('data-index');
      MockInteractions.tap(button);
      assert.isFalse(spy.called);
    });
  });

  describe('removeRequest()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
      WorkspaceTestHelper.addRequests(element);
      await nextFrame();
    });

    it('Removes request from activeRequests', () => {
      element.removeRequest(0);
      assert.lengthOf(element.activeRequests, 1);
    });

    it('Removes request at the index', () => {
      const idB = element.activeRequests[1]._id;
      element.removeRequest(0);
      assert.equal(element.activeRequests[0]._id, idB);
    });

    it('Calls __removePanel()', () => {
      const id = element.activeRequests[0]._id;
      const spy = sinon.spy(element, '__removePanel');
      element.removeRequest(0);
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][0], id);
    });

    it('Removes the panel', () => {
      const id = element.activeRequests[0]._id;
      element.removeRequest(0);
      const node = element.shadowRoot.querySelector(`request-panel[data-id="${id}"]`);
      assert.notOk(node);
    });

    it('re-sets the selection when first request which is selected', () => {
      const spy = sinon.spy();
      element.selected = 0;
      element.addEventListener('selected-changed', spy);
      element.removeRequest(0);
      assert.equal(spy.callCount, 2);
      assert.equal(spy.args[0][0].detail.value, undefined);
      assert.equal(spy.args[1][0].detail.value, 0);
    });

    it('Cheges selection if higher than index', () => {
      element.selected = 1;
      element.removeRequest(0);
      assert.equal(element.selected, 0);
    });

    it('Adds empty request when no more requests', (done) => {
      element.selected = 0;
      element.removeRequest(0);
      const spy = sinon.spy(element, 'addEmptyRequest');
      element.removeRequest(0);
      setTimeout(() => {
        assert.isTrue(spy.called);
        done();
      });
    });
  });

  describe('refreshTabs()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
      WorkspaceTestHelper.addRequests(element, 1);
      await nextFrame();
    });

    it('Calls notifyResize() on tabs', () => {
      const node = element.shadowRoot.querySelector('anypoint-tabs');
      const spy = sinon.spy(node, 'notifyResize');
      element.refreshTabs();
      assert.isTrue(spy.called);
    });
  });

  describe('_sendRequestHandler()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
    });

    function fire(element, config) {
      const detail = {
        id: 'test-id',
        url: 'http://api.domain.com'
      };
      if (config) {
        detail.config = config;
      }
      const e = new CustomEvent('api-request', {
        detail
      });
      element.dispatchEvent(e);
      return e;
    }

    it('Won\'t create a config object when no properties to add', () => {
      const e = fire(element);
      assert.isUndefined(e.detail.config);
    });

    it('Creates the config object', () => {
      element.followRedirects = true;
      const e = fire(element);
      assert.typeOf(e.detail.config, 'object');
    });

    it('Sets timeout', () => {
      element.requestTimeout = 0;
      const e = fire(element);
      assert.equal(e.detail.config.timeout, 0);
    });

    it('Will not set timeout when it is already set', () => {
      element.requestTimeout = 10;
      const e = fire(element, { timeout: 5 });
      assert.equal(e.detail.config.timeout, 5);
    });

    it('Sets sentMessageLimit', () => {
      element.sentMessageLimit = 0;
      const e = fire(element);
      assert.equal(e.detail.config.sentMessageLimit, 0);
    });

    it('Will not set sentMessageLimit when it is already set', () => {
      element.sentMessageLimit = 10;
      const e = fire(element, { sentMessageLimit: 5 });
      assert.equal(e.detail.config.sentMessageLimit, 5);
    });

    [
      'followRedirects', 'validateCertificates', 'variablesDisabled',
      'nativeTransport'
    ].forEach((prop) => {
      it(`Sets ${prop} when false`, () => {
        element[prop] = false;
        const e = fire(element);
        assert.isFalse(e.detail.config[prop]);
      });

      it(`Sets ${prop} when true`, () => {
        element[prop] = true;
        const e = fire(element);
        assert.isTrue(e.detail.config[prop]);
      });

      it(`Will not set ${prop} when it is already set`, () => {
        element[prop] = true;
        const config = {};
        config[prop] = false;
        const e = fire(element, config);
        assert.isFalse(e.detail.config[prop]);
      });
    });

    it('Sets variables', () => {
      element.variables = [{ variable: 'test' }];
      const e = fire(element);
      assert.deepEqual(e.detail.config.variables, element.variables);
    });

    it('Variables is a copy', () => {
      element.variables = [{ variable: 'test' }];
      const e = fire(element);
      e.detail.config.variables.push({ variable: 'a' });
      e.detail.config.variables[0].variable = 'other';
      assert.lengthOf(element.variables, 1, 'Array is a copy');
      assert.equal(element.variables[0].variable, 'test', 'Item is a copy');
    });

    it('Will not set variables if already set', () => {
      element.variables = [{ variable: 'test' }];
      const cnf = {
        variables: [{ variable: 'other' }]
      };
      const e = fire(element, cnf);
      assert.deepEqual(e.detail.config.variables, cnf.variables);
    });
  });

  describe('_envChangedHandler()', () => {
    let element;
    const env = 'test-env';
    beforeEach(async () => {
      element = await noAutoFixture();
    });

    function fire(node) {
      const e = new CustomEvent('selected-environment-changed', {
        bubbles: true,
        composed: true,
        detail: {
          value: env
        }
      });
      (node || document.body).dispatchEvent(e);
      return e;
    }

    it('Does nothing when restoring', () => {
      element._restoring = (true);
      fire();
      assert.isUndefined(element.environment);
    });

    it('Does nothing when dispatched by self', () => {
      fire(element);
      assert.isUndefined(element.environment);
    });

    it('Sets the environment', () => {
      fire();
      assert.equal(element.environment, env);
    });
  });

  describe('findRequestIndex()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
      WorkspaceTestHelper.addRequests(element);
    });

    it('Returns -1 when no arguments', () => {
      const result = element.findRequestIndex();
      assert.equal(result, -1);
    });

    it('Returns -1 when cannot find request', () => {
      const result = element.findRequestIndex('not-existing');
      assert.equal(result, -1);
    });

    it('Returns index of the request', () => {
      const result = element.findRequestIndex(element.activeRequests[1]._id);
      assert.equal(result, 1);
    });

    it('Returns index of the request by _tempId', () => {
      element.activeRequests[0]._tempId = 'some';
      const result = element.findRequestIndex(undefined, 'some');
      assert.equal(result, 0);
    });
  });

  describe('_getMenuRequest()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
    });

    it('Returns request object', async () => {
      WorkspaceTestHelper.addRequests(element, 1);
      await nextFrame();
      const node = element.shadowRoot.querySelector('request-panel .save-icon');
      const result = element._getMenuRequest({
        target: node
      });
      assert.typeOf(result, 'object');
    });

    it('Returns undefined when request ID cannot be find', () => {
      const parent = document.createElement('div');
      const target = document.createElement('span');
      parent.appendChild(target);
      const result = element._getMenuRequest({
        target
      });
      assert.isUndefined(result);
    });

    it('Returns undefined when request does not exist', () => {
      const parent = document.createElement('div');
      const target = document.createElement('span');
      parent.dataset.id = 'other-id';
      parent.appendChild(target);
      const result = element._getMenuRequest({
        target
      });
      assert.isUndefined(result);
    });
  });

  describe('_requestStoreHandler()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
      WorkspaceTestHelper.addRequests(element, 1);
      await nextFrame();
    });

    it('Calls _openSaveDialog()', () => {
      const node = element.shadowRoot.querySelector('request-panel .save-icon');
      assert.typeOf(node.parentElement.dataset.id, 'string', 'Parent has data-id');
      const e = {
        preventDefault: () => {},
        stopPropagation: () => {},
        target: node
      };
      const spy = sinon.spy(element, '_openSaveDialog');
      element._requestStoreHandler(e);
      assert.isTrue(spy.called);
    });

    it('Does nothing when request is not found', () => {
      const node = element.shadowRoot.querySelector('request-panel');
      assert.isUndefined(node.parentElement.dataset.id);
      const e = {
        preventDefault: () => {},
        stopPropagation: () => {},
        target: node
      };
      const spy = sinon.spy(element, '_openSaveDialog');
      element._requestStoreHandler(e);
      assert.isFalse(spy.called);
    });
  });

  describe('_renderRequestDetail()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
      WorkspaceTestHelper.addRequests(element, 1);
      await nextFrame();
    });

    it('Sets detailsOpened to true', () => {
      const node = element.shadowRoot.querySelector('request-panel .details-icon');
      assert.typeOf(node.parentElement.dataset.id, 'string', 'Parent has data-id');
      const e = {
        preventDefault: () => {},
        stopPropagation: () => {},
        target: node
      };
      element._renderRequestDetail(e);
      assert.isTrue(element.detailsOpened);
    });

    it('Sets request data on the panel', () => {
      const node = element.shadowRoot.querySelector('request-panel .details-icon');
      assert.typeOf(node.parentElement.dataset.id, 'string', 'Parent has data-id');
      const e = {
        preventDefault: () => {},
        stopPropagation: () => {},
        target: node
      };
      element._renderRequestDetail(e);
      assert.typeOf(element.requestDetails.request, 'object');
    });

    it('Does nothing when request is not found', () => {
      const node = element.shadowRoot.querySelector('request-panel');
      assert.isUndefined(node.parentElement.dataset.id);
      const e = {
        preventDefault: () => {},
        stopPropagation: () => {},
        target: node
      };
      element._renderRequestDetail(e);
      assert.isUndefined(element.detailsOpened);
    });
  });

  describe('_requestChangeHandler()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
      WorkspaceTestHelper.addRequests(element, 1);
      await nextFrame();
    });

    function fire(request, cancelable) {
      const e = new CustomEvent('request-object-changed', {
        bubbles: true,
        cancelable,
        detail: {
          request
        }
      });
      document.body.dispatchEvent(e);
      return e;
    }

    it('Updates the request', () => {
      const copy = Object.assign({}, element.activeRequests[0]);
      copy.name = 'other-name';
      fire(copy);
      assert.equal(element.activeRequests[0].name, 'other-name');
    });

    it('Updates request by tempId', () => {
      element.activeRequests[0]._tempId = 'tmp';
      const copy = Object.assign({}, element.activeRequests[0]);
      copy.name = 'other-name';
      copy._id = 'other-id';
      fire(copy);
      assert.equal(element.activeRequests[0].name, 'other-name');
    });

    it('Does nothing when request is unknown', () => {
      const request = DataGenerator.generateSavedItem();
      const old = Object.assign({}, element.activeRequests[0]);
      fire(request);
      assert.deepEqual(element.activeRequests[0], old);
    });

    it('Does nothing when event is cancelable', () => {
      const request = DataGenerator.generateSavedItem();
      const old = Object.assign({}, element.activeRequests[0]);
      fire(request, true);
      assert.deepEqual(element.activeRequests[0], old);
    });
  });

  describe('_requestDeleteHandler()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
      WorkspaceTestHelper.addRequests(element, 1);
      await nextFrame();
    });

    function fire(id, cancelable) {
      const e = new CustomEvent('request-object-deleted', {
        bubbles: true,
        cancelable,
        detail: {
          id
        }
      });
      document.body.dispatchEvent(e);
      return e;
    }

    it('Does nothing when request is unknown', () => {
      const old = Object.assign({}, element.activeRequests[0]);
      fire('some-id');
      assert.deepEqual(element.activeRequests[0], old);
    });

    it('Does nothing when event is cancelable', () => {
      const old = Object.assign({}, element.activeRequests[0]);
      fire(element.activeRequests[0]._id, true);
      assert.deepEqual(element.activeRequests[0], old);
    });

    it('Clears request name', () => {
      fire(element.activeRequests[0]._id);
      assert.equal(element.activeRequests[0].name, '');
    });

    ['type', 'driveId', 'projects', '_id', '_rev', 'created', 'updated']
    .forEach((prop) => {
      it(`Clears "${prop}" property`, () => {
        element.activeRequests[0][prop] = 'value';
        fire(element.activeRequests[0]._id);
        assert.isUndefined(element.activeRequests[0][prop]);
      });
    });
  });

  describe('addRequestById()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
    });

    function modelFactory(e) {
      e.preventDefault();
      e.stopPropagation();
      e.detail.result = new Promise((resolve) => {
        const { id } = e.detail;
        let data;
        if (id instanceof Array) {
          data = DataGenerator.generateRequests({
            requestsSize: id.length
          });
          data.forEach((item, i) => item._id = id[i]);
        } else {
          data = DataGenerator.generateSavedItem();
          data._id = id;
        }
        resolve(data);
      });
    }

    it('Rejects when model not found', () => {
      element.addEventListener('request-object-read', function f(e) {
        element.removeEventListener('request-object-read', f);
        e.stopPropagation();
      });
      return element.addRequestById('saved', 'my-id')
      .then(() => {
        throw new Error('Should not resolve');
      })
      .catch((cause) => {
        assert.equal(cause.message, 'Request model not found');
      });
    });

    it('Calls dispatch with query arguments', () => {
      element.addEventListener('request-object-read', function f(e) {
        element.removeEventListener('request-object-read', f);
        e.stopPropagation();
      });
      const spy = sinon.spy(element, '_dispatch');
      element.addRequestById('saved', 'my-id').catch(() => {});
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][0], 'request-object-read', 'Event type set');
      assert.equal(spy.args[0][1].type, 'saved');
      assert.equal(spy.args[0][1].id, 'my-id');
      assert.equal(spy.args[0][1].opts.restorePayload, true);
    });

    it('Sets "restoring" property', () => {
      element.addEventListener('request-object-read', modelFactory);
      element.addRequestById('saved', 'my-id').catch(() => {});
      element.removeEventListener('request-object-read', modelFactory);
      assert.isTrue(element.restoring);
    });

    it('Restores single request', () => {
      element.addEventListener('request-object-read', modelFactory);
      return element.addRequestById('saved', 'my-id')
      .then(() => {
        element.removeEventListener('request-object-read', modelFactory);
        assert.lengthOf(element.activeRequests, 1);
        assert.equal(element.activeRequests[0]._id, 'my-id');
      });
    });

    it('Restores multiple request', () => {
      element.addEventListener('request-object-read', modelFactory);
      return element.addRequestById('saved', ['r1', 'r2', 'r3'])
      .then(() => {
        element.removeEventListener('request-object-read', modelFactory);
        assert.lengthOf(element.activeRequests, 3);
        assert.equal(element.activeRequests[0]._id, 'r1');
        assert.equal(element.activeRequests[1]._id, 'r2');
        assert.equal(element.activeRequests[2]._id, 'r3');
      });
    });

    it('Re-sets restoring property', () => {
      element.addEventListener('request-object-read', modelFactory);
      return element.addRequestById('saved', 'my-id')
      .then(() => {
        element.removeEventListener('request-object-read', modelFactory);
        assert.isFalse(element.restoring);
      });
    });

    it('Updates request object if already exists', () => {
      const existing = DataGenerator.generateSavedItem();
      existing._id = 'r2';
      element.appendRequest(existing, {
        noAutoSelect: true
      });
      element.addEventListener('request-object-read', modelFactory);
      return element.addRequestById('saved', ['r1', 'r2', 'r3'])
      .then(() => {
        element.removeEventListener('request-object-read', modelFactory);
        assert.lengthOf(element.activeRequests, 3);
        assert.equal(element.activeRequests[0]._id, 'r2');
        assert.equal(element.activeRequests[1]._id, 'r1');
      });
    });

    it('Selectes last added', () => {
      element.addEventListener('request-object-read', modelFactory);
      return element.addRequestById('saved', ['r1', 'r2'])
      .then(() => {
        element.removeEventListener('request-object-read', modelFactory);
        assert.lengthOf(element.activeRequests, 2);
        assert.equal(element.selected, 1);
      });
    });
  });

  describe('replaceByRequestId()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
      WorkspaceTestHelper.addRequests(element, 1);
    });

    function modelFactory(e) {
      e.preventDefault();
      e.stopPropagation();
      e.detail.result = Promise.resolve({ _id: 'test' });
    }

    it('Calls clearWorkspace()', () => {
      element.addEventListener('request-object-read', modelFactory);
      const spy = sinon.spy(element, 'clearWorkspace');
      return element.replaceByRequestId('type', 'test')
      .then(() => {
        element.removeEventListener('request-object-read', modelFactory);
        assert.isTrue(spy.called, 'Function called');
        assert.isTrue(spy.args[0][0], 'Argument is set');
      });
    });

    it('Calls addRequestById()', () => {
      element.addEventListener('request-object-read', modelFactory);
      const spy = sinon.spy(element, 'addRequestById');
      return element.replaceByRequestId('saved', 'test')
      .then(() => {
        element.removeEventListener('request-object-read', modelFactory);
        assert.isTrue(spy.called, 'Function called');
        assert.equal(spy.args[0][0], 'saved', 'Type argument is set');
        assert.equal(spy.args[0][1], 'test', 'Id argument is set');
      });
    });
  });

  describe('clearWorkspace()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
      WorkspaceTestHelper.addRequests(element, 1);
    });

    it('Calls __removeAllPanels()', () => {
      const spy = sinon.spy(element, '__removeAllPanels');
      element.clearWorkspace(true);
      assert.isTrue(spy.called);
    });

    it('Request panels are not in the DOM', () => {
      element.clearWorkspace(true);
      const nodes = element.shadowRoot.querySelectorAll('request-panel');
      assert.lengthOf(nodes, 0);
    });

    it('Sets activeRequests to empty array', () => {
      element.clearWorkspace(true);
      assert.deepEqual(element.activeRequests, []);
    });

    it('Clears selection', () => {
      element.selected = 0;
      element.clearWorkspace(true);
      assert.isUndefined(element.selected);
    });

    it('Will not call addEmptyRequest() when argument is true', (done) => {
      const spy = sinon.spy(element, 'addEmptyRequest');
      element.clearWorkspace(true);
      setTimeout(() => {
        assert.isFalse(spy.called);
        done();
      });
    });

    it('Calls addEmptyRequest() when no argument', (done) => {
      const spy = sinon.spy(element, 'addEmptyRequest');
      element.clearWorkspace();
      setTimeout(() => {
        assert.isTrue(spy.called);
        done();
      });
    });
  });

  describe('appendByProject()', () => {
    let project;
    let requests;
    before(async () => {
      const result = await DataGenerator.insertSavedRequestData();
      project = result.projects.find((item) => !!item.requests.length);
      if (!project) {
        throw new Error('Chance did not produced project with requests');
      }
      requests = result.requests.filter((item) => item.projects && item.projects.indexOf(project._id) !== -1);
    });

    after(() => {
      return DataGenerator.destroySavedRequestData();
    });

    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
    });

    it('Restores by project ID', () => {
      return element.appendByProject(project._id)
      .then(() => {
        assert.lengthOf(element.activeRequests, requests.length);
      });
    });

    it('Restores project.requests list', () => {
      return element.appendByProject(project)
      .then(() => {
        assert.lengthOf(element.activeRequests, requests.length);
      });
    });

    it('Restores by project._id', () => {
      const copy = Object.assign({}, project);
      delete copy.requests;
      return element.appendByProject(project)
      .then(() => {
        assert.lengthOf(element.activeRequests, requests.length);
      });
    });

    it('Throws when no requests to request', async () => {
      const copy = Object.assign({}, project);
      delete copy.requests;
      delete copy._id;
      let called = false;
      try {
        await element.appendByProject(copy);
      } catch (e) {
        assert.equal(e.message, 'Unknown configuration');
        called = true;
      }
      assert.isTrue(called);
    });

    it('Throws when no argument', async () => {
      let called = false;
      try {
        await element.appendByProject();
      } catch (e) {
        assert.equal(e.message, 'Expecting argument.');
        called = true;
      }
      assert.isTrue(called);
    });

    it('Throws when event not handled', async () => {
      element.addEventListener('request-project-list', function f(e) {
        element.removeEventListener('request-project-list', f);
        e.stopPropagation();
      });
      let called = false;
      try {
        await element.appendByProject(project._id);
      } catch (e) {
        assert.equal(e.message, 'Request model not found');
        called = true;
      }
      assert.isTrue(called);
    });
  });

  describe('replaceByProject()', () => {
    let project;
    let requests;
    before(async () => {
      const result = await DataGenerator.insertSavedRequestData()
      project = result.projects.find((item) => !!item.requests.length);
      if (!project) {
        throw new Error('Chance did not produced project with requests');
      }
      requests = result.requests.filter((item) => item.projects && item.projects.indexOf(project._id) !== -1);
    });

    after(() => {
      return DataGenerator.destroySavedRequestData();
    });

    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
      WorkspaceTestHelper.addRequests(element, requests.length + 1);
    });

    it('Calls clearWorkspace()', () => {
      const spy = sinon.spy(element, 'clearWorkspace');
      return element.replaceByProject(project)
      .then(() => {
        assert.isTrue(spy.called, 'Function called');
        assert.isTrue(spy.args[0][0], 'Argument is set');
      });
    });

    it('Calls appendByProject()', () => {
      const spy = sinon.spy(element, 'appendByProject');
      return element.replaceByProject(project)
      .then(() => {
        assert.isTrue(spy.called, 'Function called');
        assert.deepEqual(spy.args[0][0], project, 'Argument is set');
      });
    });

    it('Replaces requests list', () => {
      return element.replaceByProject(project)
      .then(() => {
        assert.lengthOf(element.activeRequests, requests.length);
      });
    });
  });

  describe('_openProjectHandler()', () => {
    let project;
    let requests;
    before(async () => {
      const result = await DataGenerator.insertSavedRequestData();
      project = result.projects.find((item) => !!item.requests.length);
      if (!project) {
        throw new Error('Chance did not produced project with requests');
      }
      requests = result.requests.filter((item) => item.projects && item.projects.indexOf(project._id) !== -1);
    });

    after(() => {
      return DataGenerator.destroySavedRequestData();
    });

    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
      WorkspaceTestHelper.addRequests(element, requests.length + 1);
    });

    function fire(project, replace) {
      const e = new CustomEvent('workspace-open-project-requests', {
        bubbles: true,
        cancelable: true,
        detail: {
          project,
          replace
        }
      });
      document.body.dispatchEvent(e);
      return e;
    }

    it('Calls replaceByProject()', () => {
      const spy = sinon.spy(element, 'replaceByProject');
      const e = fire(project, true);
      assert.isTrue(spy.called);
      return e.detail.result;
    });

    it('Calls appendByProject()', () => {
      const spy = sinon.spy(element, 'appendByProject');
      const e = fire(project, false);
      assert.isTrue(spy.called);
      return e.detail.result;
    });

    it('Cancels the event', () => {
      const e = fire(project, false);
      assert.isTrue(e.defaultPrevented);
      return e.detail.result;
    });

    it('Ignores cancelled events', () => {
      const spy = sinon.spy(element, 'appendByProject');
      const e = {
        preventDefault: () => {},
        defaultPrevented: true,
        detail: {
          project,
          replace: true
        }
      };
      element._openProjectHandler(e);
      assert.isFalse(spy.called);
    });
  });

  describe('replaceByRequestsData()', () => {
    let element;
    let requests;
    beforeEach(async () => {
      element = await noAutoFixture();
      WorkspaceTestHelper.addRequests(element);
      requests = DataGenerator.generateRequests({
        requestsSize: 3
      });
    });

    it('Calls clearWorkspace()', () => {
      const spy = sinon.spy(element, 'clearWorkspace');
      element.replaceByRequestsData(requests);
      assert.isTrue(spy.called, 'Function called');
      assert.isTrue(spy.args[0][0], 'Argument is set');
    });

    it('Sets refreshTabs()', () => {
      const spy = sinon.spy(element, 'refreshTabs');
      element.replaceByRequestsData(requests);
      assert.isTrue(spy.called);
    });

    it('Calls appendRequest() for each request', () => {
      const spy = sinon.spy(element, 'appendRequest');
      element.replaceByRequestsData(requests);
      assert.equal(spy.callCount, 3);
      assert.deepEqual(spy.args[0][0], requests[0], 'Request argument is set');
      assert.isTrue(spy.args[0][1].skipPositionCheck, 'skipPositionCheck is set');
      assert.isTrue(spy.args[0][1].noAutoSelect, 'noAutoSelect is set');
    });

    it('Sets request _id property if missing', () => {
      delete requests[0]._id;
      element.replaceByRequestsData(requests);
      assert.typeOf(requests[0]._id, 'string');
    });

    it('Sets selected to latest request', () => {
      element.replaceByRequestsData(requests);
      assert.equal(element.selected, 2);
    });
  });

  describe('getActivePanel()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
      WorkspaceTestHelper.addRequests(element);
    });

    it('Returns panel for selected', () => {
      element.selected = 0;
      const result = element.getActivePanel();
      assert.ok(result);
    });

    it('Undefined if no selected request', () => {
      const result = element.getActivePanel();
      assert.isUndefined(result);
    });

    it('Undefined if no panel for request id', () => {
      element.selected = 0;
      element.activeRequests[0]._id = 'some-id';
      const result = element.getActivePanel();
      assert.isUndefined(result);
    });
  });

  describe('sendCurrent()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
      WorkspaceTestHelper.addRequests(element);
      element.selected = 0;
      await nextFrame();
    });

    it('Calls getActivePanel()', () => {
      const spy = sinon.spy(element, 'getActivePanel');
      element.sendCurrent();
      assert.isTrue(spy.called);
    });

    it('Calls send() on the panel', () => {
      const panel = element.getActivePanel();
      const spy = sinon.spy(panel, 'send');
      element.sendCurrent();
      assert.isTrue(spy.called);
    });
  });

  describe('abortCurrent()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
      WorkspaceTestHelper.addRequests(element);
      element.selected = 0;
      await nextFrame();
    });

    it('Calls getActivePanel()', () => {
      const spy = sinon.spy(element, 'getActivePanel');
      element.abortCurrent();
      assert.isTrue(spy.called);
    });

    it('Calls abort() on the panel', () => {
      const panel = element.getActivePanel();
      const spy = sinon.spy(panel, 'abort');
      element.abortCurrent();
      assert.isTrue(spy.called);
    });
  });

  describe('clearCurrent()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
      WorkspaceTestHelper.addRequests(element);
      element.selected = 0;
      await nextFrame();
    });

    it('Calls getActivePanel()', () => {
      const spy = sinon.spy(element, 'getActivePanel');
      element.clearCurrent();
      assert.isTrue(spy.called);
    });

    it('Calls clear() on the panel', () => {
      const panel = element.getActivePanel();
      const spy = sinon.spy(panel, 'clear');
      element.clearCurrent();
      assert.isTrue(spy.called);
    });
  });

  describe('abortAll()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
      WorkspaceTestHelper.addRequests(element);
    });

    it('Calls abort() on request panel', () => {
      element.selected = 1;
      const panel = element.getActivePanel();
      panel.loading = true;
      const spy = sinon.spy(panel, 'abort');
      element.abortAll();
      assert.isTrue(spy.called);
    });

    it('Skips panels that are not loading', () => {
      element.selected = 1;
      const panel = element.getActivePanel();
      panel.loading = false;
      const spy = sinon.spy(panel, 'abort');
      element.abortAll();
      assert.isFalse(spy.called);
    });
  });

  describe('duplicateTab()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
      WorkspaceTestHelper.addRequests(element);
      await nextFrame();
    });

    it('Does nothing if index is incorrect', () => {
      const spy = sinon.spy(element, 'appendRequest');
      element.duplicateTab(3);
      assert.isFalse(spy.called);
    });

    it('Calls appendRequest() with arguments', () => {
      const spy = sinon.spy(element, 'appendRequest');
      element.duplicateTab(1);
      assert.isTrue(spy.called, 'Function called');
      assert.equal(spy.args[0][0].url, element.activeRequests[1].url);
      assert.isTrue(spy.args[0][1].skipPositionCheck);
    });

    it('Calls _clearRequestMeta()', () => {
      const spy = sinon.spy(element, '_clearRequestMeta');
      element.duplicateTab(1);
      assert.isTrue(spy.called);
      assert.isTrue(spy.args[0][1]);
    });

    it('Removes request properties', () => {
      const request = element.activeRequests[0];
      request.name = 'test-name';
      request.driveId = 'test-drive-id';
      request.projects = ['project-id'];
      request.type = 'saved';
      request.legacyProject = 'abc';
      element.duplicateTab(0);
      assert.lengthOf(element.activeRequests, 3);
      const copy = element.activeRequests[2];
      assert.notEqual(copy._id, request._id, + '_id is cleared');
      ['_rev', 'name', 'driveId', 'projects', 'type', 'legacyProject']
      .forEach((prop) => {
        assert.isUndefined(copy[prop], prop + ' is cleared');
      });
    });
  });

  describe('_clearRequestMeta()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
    });

    it('Removes properties with "_"', () => {
      const obj = {
        _a: true,
        b: true
      };
      element._clearRequestMeta(obj);
      assert.isUndefined(obj._a);
    });

    it('Keeps other properties', () => {
      const obj = {
        _a: true,
        b: true
      };
      element._clearRequestMeta(obj);
      assert.isTrue(obj.b);
    });

    it('Will not clear _id', () => {
      const obj = {
        _id: 'true',
        _rev: 'true'
      };
      element._clearRequestMeta(obj);
      assert.equal(obj._id, 'true');
    });

    it('Will not clear _rev', () => {
      const obj = {
        _id: 'true',
        _rev: 'true'
      };
      element._clearRequestMeta(obj);
      assert.equal(obj._rev, 'true');
    });

    it('Removes _id when includeIds is set', () => {
      const obj = {
        _id: 'true',
        _rev: 'true'
      };
      element._clearRequestMeta(obj, true);
      assert.isUndefined(obj._id);
    });

    it('Removes _rev when includeIds is set', () => {
      const obj = {
        _id: 'true',
        _rev: 'true'
      };
      element._clearRequestMeta(obj, true);
      assert.isUndefined(obj._rev);
    });
  });

  describe('closeActiveTab()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
      WorkspaceTestHelper.addRequests(element, 1);
      element.selected = 0;
    });

    it('Calls removeRequest() with argument', () => {
      const spy = sinon.spy(element, 'removeRequest');
      element.closeActiveTab();
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][0], 0);
    });

    it('Removes the request', () => {
      element.closeActiveTab();
      assert.deepEqual(element.activeRequests, []);
    });
  });

  describe('openWebUrlInput()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
    });

    it('Opens the dialog', () => {
      element.openWebUrlInput();
      assert.isTrue(element.webUrlInput.opened);
    });
  });

  describe('openWorkspaceDetails()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
    });

    it('Opens the viewer', () => {
      element.openWorkspaceDetails();
      assert.isTrue(element.workspaceDetailsOpened);
    });

    [
      ['published', '2019-04-25T02:51:47.975Z'],
      ['version', 'test-version'],
      ['description', 'test-description']
    ].forEach((item) => {
      it(`Sets ${item[0]} property`, () => {
        const prop = item[0];
        element[prop] = item[1];
        element.openWorkspaceDetails();
        const node = element.shadowRoot.querySelector('arc-workspace-detail');
        assert.equal(node[prop], item[1]);
      });
    });

    it('Sets provider property', () => {
      const value = { name: 'test' };
      element.provider = value;
      element.openWorkspaceDetails();
      const node = element.shadowRoot.querySelector('arc-workspace-detail');
      assert.deepEqual(node.provider, value);
    });
  });

  describe('openWorkspaceEditor()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
    });

    it('Opens the editor', () => {
      element.openWorkspaceEditor();
      assert.isTrue(element.workspaceEditorOpened);
    });

    [
      ['published', '2019-04-25T02:51:47.975Z'],
      ['version', 'test-version'],
      ['description', 'test-description']
    ].forEach((item) => {
      it(`Sets ${item[0]} property`, () => {
        const prop = item[0];
        element[prop] = item[1];
        element.openWorkspaceEditor();
        const node = element.shadowRoot.querySelector('arc-workspace-editor');
        assert.equal(node[prop], item[1]);
      });
    });

    it('Sets provider property', () => {
      const value = { name: 'test' };
      element.provider = value;
      element.openWorkspaceEditor();
      const node = element.shadowRoot.querySelector('arc-workspace-editor');
      assert.deepEqual(node.provider, value);
    });
  });

  describe('_cancelWorkspaceEdit()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
    });

    it('Re-sets workspaceEditorOpened', () => {
      element.workspaceEditorOpened = true;
      element._cancelWorkspaceEdit();
      assert.isFalse(element.workspaceEditorOpened);
    });
  });

  describe('_updateWorkspaceMeta()', () => {
    let detail;
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
      detail = {
        version: 'test-version',
        published: 'test-published',
        description: 'test-description',
        provider: {
          name: 'test-name'
        }
      };
    });


    [
      'published', 'version', 'description'
    ].forEach((item) => {
      it(`Sets ${item} property`, () => {
        element._updateWorkspaceMeta({ detail });
        assert.equal(element[item], detail[item]);
      });
    });

    it('Sets provider proeprty', () => {
      element._updateWorkspaceMeta({ detail });
      assert.deepEqual(element.provider, detail.provider);
    });

    it('Sets version proeprty', () => {
      element.workspaceEditorOpened = true;
      element._updateWorkspaceMeta({ detail });
      assert.isFalse(element.workspaceEditorOpened);
    });
  });

  describe('Export encryption', () => {
    it('Enables encryption option', async () => {
      const element = await exportEncryptFixture();
      const node = element.shadowRoot.querySelector('export-options');
      assert.isTrue(node.withEncrypt);
    });
  });
});
