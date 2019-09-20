import { fixture, assert, html, nextFrame } from '@open-wc/testing';
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
        <arc-request-workspace noautoprojects noautorestore></arc-request-workspace>
      </div>
    `);
    return area.querySelector('arc-request-workspace');
  }

  describe('_dispatchExportData()', () => {
    let element;
    let opts;
    let request;
    beforeEach(async () => {
      element = await basicFixture();
      WorkspaceTestHelper.wrapStateReadEvent(element);
      opts = {
        options: { options: true },
        providerOptions: { providerOptions: true }
      };
      request = {
        id: 'test-id'
      };
    });

    it('Calls _dispatch()', () => {
      const spy = sinon.spy(element, '_dispatch');
      element._dispatchExportData(request, opts);
      assert.isTrue(spy.called);
    });

    it('Returns the event', () => {
      const e = element._dispatchExportData(request, opts);
      assert.typeOf(e, 'customevent');
    });

    it('Event has type', () => {
      const e = element._dispatchExportData(request, opts);
      assert.equal(e.type, 'arc-data-export');
    });

    it('Event has detail', () => {
      const e = element._dispatchExportData(request, opts);
      assert.typeOf(e.detail, 'object');
    });

    it('Detail has options', () => {
      const e = element._dispatchExportData(request, opts);
      assert.deepEqual(e.detail.options, opts.options);
    });

    it('Detail has providerOptions', () => {
      const e = element._dispatchExportData(request, opts);
      assert.deepEqual(e.detail.providerOptions, opts.providerOptions);
    });

    it('Detail has saved', () => {
      const e = element._dispatchExportData(request, opts);
      assert.deepEqual(e.detail.data.saved, [request]);
    });
  });

  describe('_exportRequest()', () => {
    let element;
    let request;
    let options;
    beforeEach(async () => {
      element = await basicFixture();
      WorkspaceTestHelper.wrapStateReadEvent(element);
      request = DataGenerator.generateSavedItem();
      options = {
        options: {
          provider: 'file'
        },
        providerOptions: {}
      };
    });

    it('Dispatches export event', () => {
      element.addEventListener('arc-data-export', function f(e) {
        element.removeEventListener('arc-data-export', f);
        e.preventDefault();
        e.detail.result = Promise.resolve();
      });
      const spy = sinon.spy();
      element.addEventListener('arc-data-export', spy);
      element._exportRequest(request, options);
      assert.isTrue(spy.called);
    });

    it('Opens drive confirmation toast', async () => {
      element.addEventListener('arc-data-export', function f(e) {
        element.removeEventListener('arc-data-export', f);
        e.preventDefault();
        e.detail.result = Promise.resolve();
      });
      options.options.provider = 'drive';
      element._exportRequest(request, options);
      await nextFrame();
      const toast = element.shadowRoot.querySelector('#driveSaved');
      assert.isTrue(toast.opened);
    });
  });

  describe('_cancelExportOptions()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      WorkspaceTestHelper.wrapStateReadEvent(element);
      element._exportOptionsOpened = true;
      element._exportItem = {};
    });

    it('Sets _exportOptionsOpened', () => {
      element._cancelExportOptions();
      assert.isFalse(element._exportOptionsOpened);
    });

    it('Sets _exportItem', () => {
      element._cancelExportOptions();
      assert.isUndefined(element._exportItem);
    });
  });

  describe('_generateExportFileName()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      WorkspaceTestHelper.wrapStateReadEvent(element);
    });

    it('Generates file name', () => {
      const result = element._generateExportFileName();
      assert.match(result, /^arc-request-[0-9]{4}-[0-9]{2}-[0-9]{2}.arc$/);
    });
  });

  describe('Export item menu entry', () => {
    let element;
    let event;
    beforeEach(async () => {
      element = await basicFixture();
      WorkspaceTestHelper.wrapStateReadEvent(element);
      WorkspaceTestHelper.addRequests(element, 1);
      element.selected = 0;
      await nextFrame();
      event = {
        preventDefault: () => {},
        stopPropagation: () => {}
      };
    });

    it('Opens export dialog', () => {
      event.target = element.shadowRoot.querySelector('request-panel .export-item');
      element._exportMenuHandler(event);
      assert.isTrue(element._exportOptionsOpened);
    });

    it('Sets the request', () => {
      event.target = element.shadowRoot.querySelector('request-panel .export-item');
      element._exportMenuHandler(event);
      assert.typeOf(element._exportItem, 'object');
    });
  });

  describe('Export panel propertis', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      WorkspaceTestHelper.wrapStateReadEvent(element);
      element._exportOptionsOpened = true;
      await nextFrame();
    });

    it('_exportOptions are set on the panel', () => {
      assert.typeOf(element._exportOptions, 'object', 'Object is set');
      assert.match(element._exportOptions.file, /^arc-request-[0-9]{4}-[0-9]{2}-[0-9]{2}.arc$/, 'File name is set');
      assert.equal(element._exportOptions.provider, 'file', 'Export provider is set');
      assert.typeOf(element._exportOptions.providerOptions, 'object', 'provider options is set');
      assert.deepEqual(element._exportOptions.providerOptions.parents, ['My Drive'], 'Default parent is set');
    });

    it('File property is set on export panel', () => {
      const node = element.shadowRoot.querySelector('export-options');
      assert.match(node.file, /^arc-request-[0-9]{4}-[0-9]{2}-[0-9]{2}.arc$/);
    });

    it('Provider property is set on export panel', () => {
      const node = element.shadowRoot.querySelector('export-options');
      assert.equal(node.provider, 'file');
    });

    it('provider-options property is set on export panel', () => {
      const node = element.shadowRoot.querySelector('export-options');
      assert.deepEqual(node.providerOptions, {
        parents: ['My Drive']
      });
    });
  });
});
