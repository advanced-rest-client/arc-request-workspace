import { fixture, assert, html, nextFrame } from '@open-wc/testing';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import '@advanced-rest-client/arc-models/project-model.js';
import '@advanced-rest-client/arc-models/request-model.js';
import '@advanced-rest-client/arc-models/variables-model.js';
import '../arc-workspace-editor.js';

describe('<arc-workspace-editor>', function() {
  async function basicFixture() {
    return await fixture(html`
      <arc-workspace-editor noautoprojects noautorestore></arc-workspace-editor>
    `);
  }

  describe('_toggleOptions()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Sets providerInfoOpened', () => {
      element._toggleOptions();
      assert.isTrue(element.providerInfoOpened);
    });

    it('Re-sets providerInfoOpened', () => {
      element.providerInfoOpened = true;
      element._toggleOptions();
      assert.isFalse(element.providerInfoOpened);
    });
  });

  describe('_cancel()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Dispatches cancel-edit event', () => {
      const spy = sinon.spy();
      element.addEventListener('cancel', spy);
      element._cancel();
      assert.isTrue(spy.called);
    });
  });

  describe('_save()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Dispatches save-workspace event', () => {
      const spy = sinon.spy();
      element.addEventListener('save', spy);
      element._save();
      assert.isTrue(spy.called);
    });

    it('Event bubbles', () => {
      const spy = sinon.spy();
      element.addEventListener('save', spy);
      element._save();
      assert.isTrue(spy.args[0][0].bubbles);
    });

    it('Event is cancelable', () => {
      const spy = sinon.spy();
      element.addEventListener('save', spy);
      element._save();
      assert.isTrue(spy.args[0][0].cancelable);
    });

    it('Event has detail', () => {
      const spy = sinon.spy();
      element.addEventListener('save', spy);
      element._save();
      assert.typeOf(spy.args[0][0].detail, 'object');
    });

    it('Calls serializeForm()', () => {
      const spy = sinon.spy(element, 'serializeForm');
      element._save();
      assert.isTrue(spy.called);
    });
  });

  describe('serializeForm()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Returns object', () => {
      const result = element.serializeForm();
      assert.typeOf(result, 'object');
    });

    it('Sets version', async () => {
      const version = '1.0-test';
      element.version = version;
      await nextFrame();
      const result = element.serializeForm();
      assert.equal(result.version, version);
    });

    it('Sets published', async () => {
      const published = '2019-05-21T12:15';
      element.published = published;
      await nextFrame();
      const result = element.serializeForm();
      assert.equal(result.published, published);
    });

    it('Sets description', async () => {
      const description = 'Test description';
      element.description = description;
      await nextFrame();
      const result = element.serializeForm();
      assert.equal(result.description, description);
    });

    it('Do not set provider when no properties', async () => {
      const provider = {};
      element.provider = provider;
      await nextFrame();
      const result = element.serializeForm();
      assert.isUndefined(result.provider);
    });

    it('Sets provider.url', async () => {
      const provider = { url: 'https://test' };
      element.provider = provider;
      await nextFrame();
      const result = element.serializeForm();
      assert.deepEqual(result.provider, provider);
    });

    it('Sets provider.email', async () => {
      const provider = { email: 'test@domain.com' };
      element.provider = provider;
      await nextFrame();
      const result = element.serializeForm();
      assert.deepEqual(result.provider, provider);
    });

    it('Sets provider.name', async () => {
      const provider = { name: 'Pawel Psztyc' };
      element.provider = provider;
      await nextFrame();
      const result = element.serializeForm();
      assert.deepEqual(result.provider, provider);
    });
  });
});
