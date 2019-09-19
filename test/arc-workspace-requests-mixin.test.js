import { fixture, assert, html, nextFrame } from '@open-wc/testing';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import '@advanced-rest-client/arc-models/project-model.js';
import '@advanced-rest-client/arc-models/request-model.js';
import '@advanced-rest-client/arc-models/variables-model.js';
import '../arc-request-workspace.js';

describe('ArcWorkspaceRequestsMixin', function() {
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

  function stateRestoreHandler(e) {
    e.preventDefault();
    e.detail.result = Promise.resolve();
  }

  function stateStoreHandler(e) {
    e.preventDefault();
    e.detail.result = Promise.resolve();
  }

  before(() => {
    window.addEventListener('workspace-state-read', stateRestoreHandler);
    window.addEventListener('workspace-state-store', stateStoreHandler);
  });

  after(() => {
    window.removeEventListener('workspace-state-read', stateRestoreHandler);
    window.removeEventListener('workspace-state-store', stateStoreHandler);
  });

  describe('__createPanelInstance()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Creates request-panel', () => {
      const result = element.__createPanelInstance();
      assert.equal(result.nodeName, 'REQUEST-PANEL');
    });

    it('Panel has "hidden" attribute', () => {
      const result = element.__createPanelInstance();
      assert.isTrue(result.hasAttribute('hidden'));
    });
  });

  describe('__setPanelRequestProperties()', () => {
    let element;
    let request;
    beforeEach(async () => {
      element = await basicFixture();
      request = {
        _id: 'test-id',
        _state: {},
        _responseMeta: {},
        _response: {},
        _responseError: {},
        _isErrorResponse: false
      };
    });

    it('Set data-id attribute', () => {
      const panel = element.__createPanelInstance();
      element.__setPanelRequestProperties(panel, request);
      assert.equal(panel.dataset.id, 'test-id');
    });

    it('Set "editorRequest" property', () => {
      const panel = element.__createPanelInstance();
      element.__setPanelRequestProperties(panel, request);
      assert.deepEqual(panel.editorRequest, request);
    });

    it('Set "editorState" property', () => {
      const panel = element.__createPanelInstance();
      element.__setPanelRequestProperties(panel, request);
      assert.deepEqual(panel.editorState, request._state);
    });

    it('Set "responseMeta" property', () => {
      const panel = element.__createPanelInstance();
      element.__setPanelRequestProperties(panel, request);
      assert.deepEqual(panel.responseMeta, request._responseMeta);
    });

    it('Set "response" property', () => {
      const panel = element.__createPanelInstance();
      element.__setPanelRequestProperties(panel, request);
      assert.deepEqual(panel.response, request._response);
    });

    it('Set "responseError" property', () => {
      const panel = element.__createPanelInstance();
      element.__setPanelRequestProperties(panel, request);
      assert.deepEqual(panel.responseError, request._responseError);
    });

    it('Set "isErrorResponse" property', () => {
      const panel = element.__createPanelInstance();
      element.__setPanelRequestProperties(panel, request);
      assert.deepEqual(panel.isErrorResponse, request._isErrorResponse);
    });
  });

  describe('__setPanelConfiguration()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element.narrow = true;
      element.oauth2RedirectUri = 'http://auth.com';
      element.ignoreContentOnGet = true;
      await nextFrame();
    });

    it('Sets narrow property', () => {
      const panel = element.__createPanelInstance();
      element.__setPanelConfiguration(panel);
      assert.isTrue(panel.narrow);
    });

    it('Sets oauth2RedirectUri property', () => {
      const panel = element.__createPanelInstance();
      element.__setPanelConfiguration(panel);
      assert.equal(panel.oauth2RedirectUri, 'http://auth.com');
    });

    it('Sets oauth2RedirectUri property from _workspaceOauth2RedirectUri', async () => {
      element._workspaceOauth2RedirectUri = 'http://other.com';
      await nextFrame();
      const panel = element.__createPanelInstance();
      element.__setPanelConfiguration(panel);
      assert.equal(panel.oauth2RedirectUri, 'http://other.com');
    });

    it('Sets ignoreContentOnGet propery', () => {
      const panel = element.__createPanelInstance();
      element.__setPanelConfiguration(panel);
      assert.isTrue(panel.ignoreContentOnGet);
    });
  });

  describe('__addPanelListeners()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Adds event listener', () => {
      const panel = element.__createPanelInstance();
      element.__addPanelListeners(panel);
    });
  });

  describe('__removePanelListeners()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Adds event listener', () => {
      const panel = element.__createPanelInstance();
      element.__removePanelListeners(panel);
    });
  });

  describe('__getPanelById()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Returns null when no such panel', () => {
      const result = element.__getPanelById('some-id');
      assert.equal(result, null);
    });

    it('Returns the panel', () => {
      const panel = element.__createPanelInstance();
      element.__setPanelRequestProperties(panel, { _id: 'test-id' });
      element.contentElement.appendChild(panel);
      const result = element.__getPanelById('test-id');
      assert.ok(result);
    });
  });

  describe('__addPanel()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Throws when adding panel without request', () => {
      assert.throws(() => {
        element.__addPanel();
      }, 'Request object is required when adding request panel');
    });

    it('Throws when adding panel without _id property', () => {
      assert.throws(() => {
        element.__addPanel({});
      }, 'Missing request id when adding request panel');
    });

    it('Adds panel with request', (done) => {
      element.__addPanel({
        _id: 'test-id'
      });
      const panel = element.__getPanelById('test-id');
      assert.ok(panel);
      setTimeout(() => {
        done();
      });
    });

    it('Calls __setPanelRequestProperties()', (done) => {
      const spy = sinon.spy(element, '__setPanelRequestProperties');
      element.__addPanel({
        _id: 'test-id'
      });
      setTimeout(() => {
        assert.isTrue(spy.called);
        done();
      });
    });

    it('Calls __addPanelListeners()', (done) => {
      const spy = sinon.spy(element, '__addPanelListeners');
      element.__addPanel({
        _id: 'test-id'
      });
      setTimeout(() => {
        assert.isTrue(spy.called);
        done();
      });
    });

    it('Calls __setPanelConfiguration()', (done) => {
      const spy = sinon.spy(element, '__setPanelConfiguration');
      element.__addPanel({
        _id: 'test-id'
      });
      setTimeout(() => {
        assert.isTrue(spy.called);
        done();
      });
    });
  });

  describe('__removePanel()', () => {
    let element;
    const id = 'test-id';
    beforeEach(async () => {
      element = await basicFixture();
      element.__addPanel({
        _id: id
      });
      await nextFrame();
    });

    it('Removes panel from the shadow DOM', () => {
      element.__removePanel(id);
      const result = element.__getPanelById(id);
      assert.notOk(result);
    });

    it('Calls __removePanelListeners()', () => {
      const spy = sinon.spy(element, '__removePanelListeners');
      element.__removePanel(id);
      assert.isTrue(spy.called);
    });

    it('Does nothing when panel not found', () => {
      const spy = sinon.spy(element, '__removePanelListeners');
      element.__removePanel('other-id');
      assert.isFalse(spy.called);
    });
  });

  describe('__deselectPanels()', () => {
    let element;
    let p1;
    let p2;
    beforeEach(async () => {
      element = await basicFixture();
      const r1 = {
        _id: 'p1',
        url: 'http://test.org',
        method: 'GET'
      };
      const r2 = {
        _id: 'p2',
        url: 'http://test.com',
        method: 'GET'
      };
      element.__addPanel(r1);
      element.__addPanel(r2);
      element.activeRequests = [r1, r2];
      p1 = element.__getPanelById('p1');
      p2 = element.__getPanelById('p2');
      p1.removeAttribute('hidden');
      p2.removeAttribute('hidden');
      await nextFrame();
    });

    it('Hides all panels', () => {
      element.__deselectPanels();
      assert.isTrue(p1.hasAttribute('hidden'));
      assert.isTrue(p2.hasAttribute('hidden'));
    });
  });

  describe('__selectPanel()', () => {
    let element;
    let p1;
    let p2;
    beforeEach(async () => {
      element = await basicFixture();
      const r1 = {
        _id: 'p1',
        url: 'http://test.org',
        method: 'GET'
      };
      const r2 = {
        _id: 'p2',
        url: 'http://test.com',
        method: 'GET'
      };
      element.__addPanel(r1);
      element.__addPanel(r2);
      element.activeRequests = [r1, r2];
      p1 = element.__getPanelById('p1');
      p2 = element.__getPanelById('p2');
      await nextFrame();
    });

    it('Selects the panel', () => {
      element.__selectPanel('p1');
      assert.isFalse(p1.hasAttribute('hidden'));
      assert.isTrue(p2.hasAttribute('hidden'));
    });

    it('Selects already selected panel', () => {
      p1.removeAttribute('hidden');
      element.__selectPanel('p1');
      assert.isFalse(p1.hasAttribute('hidden'));
      assert.isTrue(p2.hasAttribute('hidden'));
    });

    it('Does nothing when panel is not found', () => {
      element.__selectPanel('other');
      assert.isTrue(p1.hasAttribute('hidden'));
      assert.isTrue(p2.hasAttribute('hidden'));
    });
  });

  describe('__updatePanelRequest()', () => {
    let element;
    let p1;
    let p2;
    beforeEach(async () => {
      element = await basicFixture();
      const r1 = {
        _id: 'p1',
        url: 'http://test.org',
        method: 'GET'
      };
      const r2 = {
        _id: 'p2',
        url: 'http://test.com',
        method: 'GET'
      };
      element.__addPanel(r1);
      element.__addPanel(r2);
      element.activeRequests = [r1, r2];
      p1 = element.__getPanelById('p1');
      p2 = element.__getPanelById('p2');
      await nextFrame();
    });

    it('Does nothing when id not found', () => {
      const spy = sinon.spy(element, '__setPanelRequestProperties');
      element.__updatePanelRequest('other', { _id: 'other' });
      assert.isFalse(spy.called);
    });

    it('Updates request at a position', () => {
      const spy = sinon.spy(element, '__setPanelRequestProperties');
      const request = {
        _id: 'p1',
        url: 'http://api.domain.com',
        method: 'POST'
      };
      element.__updatePanelRequest('p1', request);
      assert.isTrue(spy.called);
      assert.isTrue(spy.args[0][0] === p1);
      assert.deepEqual(spy.args[0][1], request);
      assert.equal(p1.dataset.id, 'p1');
    });

    it('Replaces request at a position', () => {
      const spy = sinon.spy(element, '__setPanelRequestProperties');
      const request = {
        _id: 'p3',
        url: 'http://api.domain.com',
        method: 'POST'
      };
      element.__updatePanelRequest('p2', request);
      assert.isTrue(spy.called);
      assert.isTrue(spy.args[0][0] === p2);
      assert.deepEqual(spy.args[0][1], request);
      assert.equal(p2.dataset.id, 'p3');
    });
  });

  describe('__removeAllPanels()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      const r1 = {
        _id: 'p1',
        url: 'http://test.org',
        method: 'GET'
      };
      const r2 = {
        _id: 'p2',
        url: 'http://test.com',
        method: 'GET'
      };
      element.__addPanel(r1);
      element.__addPanel(r2);
      element.activeRequests = [r1, r2];
      await nextFrame();
    });

    it('Removes panels from the container', () => {
      element.__removeAllPanels();
      const nodes = element.shadowRoot.querySelectorAll('request-panel');
      assert.lengthOf(nodes, 0);
    });

    it('Removes event listeners from the panels', () => {
      const spy = sinon.spy(element, '__removePanelListeners');
      element.__removeAllPanels();
      assert.isTrue(spy.called);
    });
  });

  describe('__updatePanelsProperty()', () => {
    let element;
    let p1;
    let p2;
    beforeEach(async () => {
      element = await basicFixture();
      const r1 = {
        _id: 'p1',
        url: 'http://test.org',
        method: 'GET'
      };
      const r2 = {
        _id: 'p2',
        url: 'http://test.com',
        method: 'GET'
      };
      element.__addPanel(r1);
      element.__addPanel(r2);
      element.activeRequests = [r1, r2];
      p1 = element.__getPanelById('p1');
      p2 = element.__getPanelById('p2');
      element.selected = 0;
      await nextFrame();
    });

    it('Updates a property on all panels', () => {
      element.__updatePanelsProperty('narrow', true);
      assert.isTrue(p1.narrow);
      assert.isTrue(p2.narrow);
    });

    it('Updates narrow property when workspace property change', async () => {
      element.narrow = true;
      await nextFrame();
      assert.isTrue(p1.narrow);
      assert.isTrue(p2.narrow);
    });

    it('Updates oauth2RedirectUri when workspace property change', async () => {
      element.oauth2RedirectUri = 'http://auth.com';
      await nextFrame();
      assert.equal(p1.oauth2RedirectUri, 'http://auth.com');
      assert.equal(p2.oauth2RedirectUri, 'http://auth.com');
    });

    it('Updates ignoreContentOnGet when workspace property change', async () => {
      element.ignoreContentOnGet = true;
      await nextFrame();
      assert.isTrue(p1.ignoreContentOnGet);
      assert.isTrue(p2.ignoreContentOnGet);
    });
  });
});
