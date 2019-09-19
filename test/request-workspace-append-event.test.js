import { fixture, assert, html, aTimeout } from '@open-wc/testing';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import { DataGenerator } from '@advanced-rest-client/arc-data-generator/arc-data-generator.js';
import '@advanced-rest-client/arc-models/project-model.js';
import '@advanced-rest-client/arc-models/request-model.js';
import '@advanced-rest-client/arc-models/variables-model.js';
import '../arc-request-workspace.js';

describe('<arc-request-workspace>', function() {
  async function basicFixture() {
    const area = await fixture(html`
    <div>
      <project-model></project-model>
      <request-model></request-model>
      <variables-model></variables-model>
      <arc-request-workspace></arc-request-workspace>
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

  describe('request-workspace-append event', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture()
      await aTimeout(25);
    });

    function fire(detail) {
      document.body.dispatchEvent(new CustomEvent('request-workspace-append', {
        bubbles: true,
        detail
      }));
    }

    it('Appends request to the list of requests', () => {
      const url = 'https://test.com';
      fire({
        kind: 'ARC#Request',
        request: {
          method: 'POST',
          url
        }
      });
      assert.lengthOf(element.activeRequests, 1);
      assert.equal(element.activeRequests[0].url, url);
    });

    it('Calls appendImportRequests() for project data', () => {
      const saved = DataGenerator.generateSavedRequestData({
        requestsSize: 3
      });
      const detail = {
        kind: 'ARC#ProjectExport',
        projects: saved.projects,
        requests: saved.requests
      };
      const spy = sinon.spy(element, 'appendImportRequests');
      fire(detail);
      assert.deepEqual(spy.args[0][0], detail);
    });

    it('Calls appendImportRequests() for saved data', () => {
      const saved = DataGenerator.generateSavedRequestData({
        requestsSize: 3
      });
      const detail = {
        kind: 'ARC#SavedExport',
        requests: saved.requests
      };
      const spy = sinon.spy(element, 'appendImportRequests');
      fire(detail);
      assert.deepEqual(spy.args[0][0], detail);
    });

    it('Calls appendImportRequests() for history data', () => {
      const history = DataGenerator.generateHistoryRequestsData({
        requestsSize: 3
      });
      const detail = {
        kind: 'ARC#HistoryExport',
        history
      };
      const spy = sinon.spy(element, 'appendImportRequests');
      fire(detail);
      assert.deepEqual(spy.args[0][0], detail);
    });
  });

  describe('appendImportRequests()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
    });

    it('Appends Project export data', () => {
      const saved = DataGenerator.generateSavedRequestData({
        requestsSize: 3
      });
      const detail = {
        kind: 'ARC#ProjectExport',
        projects: saved.projects,
        requests: saved.requests
      };
      element.appendImportRequests(detail);
      assert.lengthOf(element.activeRequests, 3, 'Request are added');
      assert.equal(element.selected, 2, 'Selection is set');
    });

    it('Appends Saved export data', () => {
      const saved = DataGenerator.generateSavedRequestData({
        requestsSize: 4
      });
      const detail = {
        kind: 'ARC#SavedExport',
        requests: saved.requests
      };
      element.appendImportRequests(detail);
      assert.lengthOf(element.activeRequests, 4, 'Request are added');
      assert.equal(element.selected, 3, 'Selection is set');
    });

    it('Appends History export data', () => {
      const history = DataGenerator.generateHistoryRequestsData({
        requestsSize: 3
      });
      const detail = {
        kind: 'ARC#HistoryExport',
        history
      };
      element.appendImportRequests(detail);
      assert.lengthOf(element.activeRequests, 3, 'Request are added');
      assert.equal(element.selected, 2, 'Selection is set');
    });
  });
});
