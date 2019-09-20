import { fixture, assert, html, nextFrame, aTimeout } from '@open-wc/testing';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import { DataGenerator } from '@advanced-rest-client/arc-data-generator/arc-data-generator.js';
import '@advanced-rest-client/arc-models/project-model.js';
import '@advanced-rest-client/arc-models/request-model.js';
import '@advanced-rest-client/arc-models/variables-model.js';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import '../arc-request-workspace.js';

describe('ArcWorkspaceDndMixin', function() {
  async function basicFixture() {
    const area = await fixture(html`
      <div>
        <project-model></project-model>
        <request-model></request-model>
        <variables-model></variables-model>
        <arc-request-workspace noautoprojects noautorestore draggableenabled></arc-request-workspace>
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

  before(async () => {
    window.addEventListener('workspace-state-read', stateRestoreHandler);
    window.addEventListener('workspace-state-store', stateStoreHandler);
  });

  after(() => {
    window.removeEventListener('workspace-state-read', stateRestoreHandler);
    window.removeEventListener('workspace-state-store', stateStoreHandler);
  });

  function addRequests(element, size) {
    const requests = DataGenerator.generateRequests({
      requestsSize: size || 2
    });
    for (let i = 0; i < requests.length; i++) {
      requests[i].name = 'Test request name #' + i;
      element.__addPanel(requests[i]);
    }
    element.activeRequests = requests;
  }

  class MockedDataTransfer {
    constructor() {
      this._data = {};
      this.effectAllowed = 'none';
      this.dropEffect = 'none';
    }
    setData(type, data) {
      this._data[type] = String(data);
    }
    getData(type) {
      return this._data[type] || '';
    }
    get types() {
      return Object.keys(this._data);
    }
  }

  describe('_dragStart()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      addRequests(element, 1);
      element._startReorderDrag = () => {};
      element._removeTabSelectionColor = () => {};
      await nextFrame();
    });

    function dispatch(element) {
      const node = element.shadowRoot.querySelector('.tabs anypoint-tab');
      const e = new Event('dragstart');
      e.dataTransfer = new MockedDataTransfer();
      node.dispatchEvent(e);
      return e;
    }

    it('sets arc/request-object transfer data', () => {
      const e = dispatch(element);
      const data = e.dataTransfer.getData('arc/request-object');
      assert.typeOf(data, 'string');
    });

    it('Sets arc/history-request data', () => {
      element.activeRequests[0].type = 'history';
      const e = dispatch(element);
      const data = e.dataTransfer.getData('arc/history-request');
      assert.equal(data, element.activeRequests[0]._id);
    });

    it('Sets arc/history-request data', () => {
      element.activeRequests[0].type = 'saved';
      const e = dispatch(element);
      const data = e.dataTransfer.getData('arc/saved-request');
      assert.equal(data, element.activeRequests[0]._id);
    });

    it('Sets arc-source/requests-workspace transfer data', () => {
      const e = dispatch(element);
      const data = e.dataTransfer.getData('arc-source/requests-workspace');
      assert.equal(data, element.activeRequests[0]._id);
    });

    it('Ignores event when draggableEnabled not set', () => {
      element.draggableEnabled = false;
      const e = dispatch(element);
      assert.equal(e.dataTransfer.dropEffect, 'none');
    });

    it('Sets effectAllowed', () => {
      const e = dispatch(element);
      assert.equal(e.dataTransfer.effectAllowed, 'copyMove');
    });

    it('Calls _startReorderDrag()', () => {
      const spy = sinon.spy(element, '_startReorderDrag');
      dispatch(element);
      assert.isTrue(spy.called);
    });

    it('Calls _removeTabSelectionColor()', async () => {
      const spy = sinon.spy(element, '_removeTabSelectionColor');
      dispatch(element);
      await aTimeout();
      assert.isTrue(spy.called);
    });
  });

  describe('_removeTabSelectionColor()', () => {
    let element;
    let node;
    beforeEach(async () => {
      element = await basicFixture();
      element.style.setProperty('--anypoint-tabs-selection-bar-color', 'red');
      node = document.createElement('div');
    });

    it('Sets __tabsSelectionColor', () => {
      element._removeTabSelectionColor(node);
      assert.equal(element.__tabsSelectionColor, 'red');
    });

    it('Sets --anypoint-tabs-selection-bar-color variable', () => {
      element._removeTabSelectionColor(node);
      const style = getComputedStyle(element.tabsElement);
      const result = style.getPropertyValue('--anypoint-tabs-selection-bar-color').trim();
      assert.equal(result, 'transparent');
    });

    it('Sets __tabsInitialDisplay', () => {
      element._removeTabSelectionColor(node);
      assert.typeOf(element.__tabsInitialDisplay, 'string');
    });

    it('Hiddes passed node', () => {
      element._removeTabSelectionColor(node);
      assert.equal(node.style.visibility, 'hidden');
    });
  });

  describe('_startReorderDrag()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      addRequests(element, 1);
      element._removeTabSelectionColor = () => {};
      await nextFrame();
    });

    function dispatch(element) {
      const node = element.shadowRoot.querySelector('.tabs anypoint-tab');
      const e = new Event('dragstart');
      e.dataTransfer = new MockedDataTransfer();
      node.dispatchEvent(e);
    }

    it('Sets __reorderInfo object properties', (done) => {
      dispatch(element);
      setTimeout(() => {
        assert.equal(element.__reorderInfo.type, 'track', 'Type is set');
        assert.ok(element.__reorderInfo.dragElement, 'dragElement is set');
        assert.equal(element.__reorderInfo.dragIndex, 0, 'dragIndex is set');
        done();
      });
    });

    it('Blocks the editors', (done) => {
      const spy = sinon.spy(element, '_blockEditors');
      dispatch(element);
      setTimeout(() => {
        assert.isTrue(spy.called);
        done();
      });
    });
  });

  describe('_dragEnd()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element._finishReorder = () => {};
      element._unblockEditors = () => {};
      element.refreshTabs = () => {};
    });

    function createEvent() {
      const e = new Event('dragend');
      e.dataTransfer = new MockedDataTransfer();
      return e;
    }

    it('Does nothing when initial state', () => {
      const spy = sinon.spy(element, '_finishReorder');
      const e = createEvent();
      element._dragEnd(e);
      assert.isFalse(spy.called);
    });

    it('Calls _finishReorder()', () => {
      element.__reorderInfo.type = 'track';
      const spy = sinon.spy(element, '_finishReorder');
      const e = createEvent();
      element._dragEnd(e);
      assert.isTrue(spy.args[0][0] === e);
    });

    it('Calls refreshTabs()', () => {
      element.__reorderInfo.type = 'track';
      const spy = sinon.spy(element, 'refreshTabs');
      const e = createEvent();
      element._dragEnd(e);
      assert.isTrue(spy.called);
    });

    it('Calls _unblockEditors()', () => {
      element.__reorderInfo.type = 'track';
      const spy = sinon.spy(element, '_unblockEditors');
      const e = createEvent();
      element._dragEnd(e);
      assert.isTrue(spy.called);
    });
  });

  describe('_dragoverHandler()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element._reorderDragover = () => {};
      element._newTabDragover = () => {};
      await nextFrame();
    });

    function dispatch(element, types) {
      if (!types) {
        types = ['arc/request-object'];
      }
      const e = new Event('dragover', { cancelable: true });
      e.dataTransfer = new MockedDataTransfer();
      types.forEach((type) => {
        e.dataTransfer.setData(type, 'test');
      });
      const node = element.shadowRoot.querySelector('.tabs');
      node.dispatchEvent(e);
      return e;
    }

    it('Ignores event when draggableEnabled is not set', () => {
      element.draggableEnabled = false;
      element._dragoverHandler();
      // no error
    });

    it('Ignores event when supported type is not set', () => {
      const spy = sinon.spy(element, '_newTabDragover');
      dispatch(element, ['other']);
      assert.isFalse(spy.called);
    });

    it('Handles the event when arc/request-object', () => {
      const spy = sinon.spy(element, '_newTabDragover');
      dispatch(element);
      assert.isTrue(spy.called);
    });

    it('Handles the event when arc/project-object', () => {
      const spy = sinon.spy(element, '_newTabDragover');
      dispatch(element, ['arc/project-object']);
      assert.isTrue(spy.called);
    });

    it('Cancels the event', () => {
      const e = dispatch(element);
      assert.isTrue(e.defaultPrevented);
    });

    it('Sets dropEffect for new tab', () => {
      const e = dispatch(element);
      assert.equal(e.dataTransfer.dropEffect, 'copy');
    });

    it('Sets dropEffect for reorder', () => {
      const e = dispatch(element, ['arc/request-object', 'arc-source/requests-workspace']);
      assert.equal(e.dataTransfer.dropEffect, 'move');
    });

    it('Calls _reorderDragover()', () => {
      const spy = sinon.spy(element, '_reorderDragover');
      dispatch(element, ['arc/request-object', 'arc-source/requests-workspace']);
      assert.isTrue(spy.called);
    });
  });

  describe('_dragleaveHandler()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      await nextFrame();
    });

    function dispatch(element, types) {
      if (!types) {
        types = ['arc/request-object'];
      }
      const e = new Event('dragleave', { cancelable: true });
      e.dataTransfer = new MockedDataTransfer();
      types.forEach((type) => {
        e.dataTransfer.setData(type, 'test');
      });
      const node = element.shadowRoot.querySelector('.tabs');
      node.dispatchEvent(e);
      return e;
    }

    it('Ignores event when draggableEnabled is not set', () => {
      element.draggableEnabled = false;
      element._dragleaveHandler();
      // no error
    });

    it('Ignores event when supported type is not set', () => {
      const e = dispatch(element, ['other']);
      assert.isFalse(e.defaultPrevented);
    });

    it('Handles the event when arc/request-object', () => {
      const e = dispatch(element);
      assert.isTrue(e.defaultPrevented);
    });

    it('Handles the event when arc/project-object', () => {
      const e = dispatch(element, ['arc/project-object']);
      assert.isTrue(e.defaultPrevented);
    });

    it('Calls _removeDropPointer()', () => {
      const spy = sinon.spy(element, '_removeDropPointer');
      dispatch(element);
      assert.isTrue(spy.called);
    });

    it('Clears __dropPointerReference', () => {
      element.__dropPointerReference = 'test';
      dispatch(element);
      assert.isUndefined(element.__dropPointerReference);
    });
  });

  describe('_removeRipples()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Does nothing when passed element does not have paper-ripple', () => {
      const node = document.createElement('iron-icon');
      document.body.appendChild(node);
      element._removeRipples(node);
      document.body.removeChild(node);
      // no errors, coverage
    });

    it('Removes ripples from a tab', async () => {
      addRequests(element, 1);
      await nextFrame();
      const node = element.shadowRoot.querySelector('.tabs anypoint-tab');
      MockInteractions.tap(node);
      await nextFrame();
      element._removeRipples(node);
      const ripple = node.shadowRoot.querySelector('paper-ripple');
      assert.lengthOf(ripple.ripples, 0);
    });
  });

  describe('_finishReorder()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element._removeRipples = () => {};
      element._rearrangeReorder = () => {};
      element._resetReorderChildren = () => {};
      element._resetReorderState = () => {};
      element._resetReorderStyles = () => {};
    });

    function createEvent() {
      const e = new Event('dragend');
      e.dataTransfer = new MockedDataTransfer();
      return e;
    }

    it('Calls _removeRipples() with an argument', () => {
      const node = document.createElement('div');
      element.__reorderInfo.dragElement = node;
      const spy = sinon.spy(element, '_removeRipples');
      const e = createEvent();
      element._finishReorder(e);
      assert.isTrue(spy.args[0][0] === node);
    });

    it('Calls _rearrangeReorder()', () => {
      const spy = sinon.spy(element, '_rearrangeReorder');
      const e = createEvent();
      element._finishReorder(e);
      assert.isTrue(spy.called);
    });

    it('Calls _resetReorderChildren()', () => {
      const spy = sinon.spy(element, '_resetReorderChildren');
      const e = createEvent();
      element._finishReorder(e);
      assert.isTrue(spy.called);
    });

    it('Calls _resetReorderState()', () => {
      const spy = sinon.spy(element, '_resetReorderState');
      const e = createEvent();
      element._finishReorder(e);
      assert.isTrue(spy.called);
    });

    it('Calls _resetReorderStyles() with an argument', () => {
      const spy = sinon.spy(element, '_resetReorderStyles');
      const e = createEvent();
      element._finishReorder(e);
      assert.isTrue(spy.args[0][0] === e);
    });

    it('Skips selection when no movement', () => {
      const e = createEvent();
      element._finishReorder(e);
      assert.isUndefined(element.selected);
    });

    it('Sets selection when _rearrangeReorder() returns a value', () => {
      element._rearrangeReorder = () => 2;
      const e = createEvent();
      element._finishReorder(e);
      assert.equal(element.selected, 2);
    });

    it('Sets selection when _rearrangeReorder() returns 0', () => {
      element._rearrangeReorder = () => 0;
      const e = createEvent();
      element._finishReorder(e);
      assert.equal(element.selected, 0);
    });
  });

  describe('_rearrangeReorder()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Returns undefined when no dragIndex', () => {
      const result = element._rearrangeReorder();
      assert.isUndefined(result);
    });

    it('Returns undefined when no overIndex', () => {
      element.__reorderInfo.dragIndex = 1;
      const result = element._rearrangeReorder();
      assert.isUndefined(result);
    });

    it('Rearranges the array', () => {
      element.activeRequests = DataGenerator.generateRequests({
        requestsSize: 3
      });
      const id1 = element.activeRequests[0]._id;
      const id2 = element.activeRequests[1]._id;
      const id3 = element.activeRequests[2]._id;
      element.__reorderInfo.dragIndex = 2;
      element.__reorderInfo.overIndex = 0;
      element._rearrangeReorder();
      assert.equal(element.activeRequests[0]._id, id3);
      assert.equal(element.activeRequests[1]._id, id1);
      assert.equal(element.activeRequests[2]._id, id2);
    });

    it('Returns insert position', () => {
      element.activeRequests = DataGenerator.generateRequests({
        requestsSize: 3
      });
      element.__reorderInfo.dragIndex = 2;
      element.__reorderInfo.overIndex = 1;
      const result = element._rearrangeReorder();
      assert.equal(result, 1);
    });
  });

  describe('_resetReorderStyles()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element.__tabsSelectionColor = 'red';
      await nextFrame();
    });

    function createEvent() {
      const e = {
        currentTarget: document.createElement('div')
      };
      return e;
    }

    it('Sets current target visibility', () => {
      const e = createEvent();
      element._resetReorderStyles(e);
      assert.equal(e.currentTarget.style.visibility, 'visible');
    });

    it('Resets --anypoint-tabs-selection-bar-color variable', () => {
      const e = createEvent();
      element._resetReorderStyles(e);
      const style = getComputedStyle(element.tabsElement);
      const result = style.getPropertyValue('--anypoint-tabs-selection-bar-color').trim();
      assert.equal(result, 'red');
    });
  });

  describe('_resetReorderChildren()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      addRequests(element, 1);
      await nextFrame();
    });

    it('Removes "transform" style', () => {
      const node = element.tabsElement.querySelector('anypoint-tab');
      node.style.transform = 'translate3d(100px, 0px, 0px)';
      element._resetReorderChildren();
      assert.equal(node.style.transform, '');
    });

    it('Removes "moving" class', () => {
      const node = element.tabsElement.querySelector('anypoint-tab');
      node.classList.add('moving');
      element._resetReorderChildren();
      assert.isFalse(node.classList.contains('moving'));
    });
  });

  describe('_dropRequest()', () => {
    let element;
    let request;
    beforeEach(async () => {
      element = await basicFixture();
      element.clearWorkspace = () => {};
      element.appendRequest = () => {};
      element.appendRequestAt = () => {};
      element._computeDropOrder = () => 2;
      request = {
        _id: 'test-id'
      };
    });

    function createEvent() {
      const e = new Event('dragend');
      e.dataTransfer = new MockedDataTransfer();
      e.dataTransfer.setData('arc/request-object', JSON.stringify(request));
      e.ctrlKey = false;
      e.metaKey = false;
      return e;
    }

    it('Calls appendRequestAt() with arguments', () => {
      const e = createEvent();
      const spy = sinon.spy(element, 'appendRequestAt');
      element._dropRequest(e);
      // this implies calling `_computeDropOrder`
      assert.equal(spy.args[0][0], 2);
      assert.deepEqual(spy.args[0][1], request);
    });

    it('Calls clearWorkspace() with ctrl key', () => {
      const e = createEvent();
      e.ctrlKey = true;
      const spy = sinon.spy(element, 'clearWorkspace');
      element._dropRequest(e);
      assert.isTrue(spy.args[0][0]);
    });

    it('Calls appendRequest() with ctrl key', () => {
      const e = createEvent();
      e.ctrlKey = true;
      const spy = sinon.spy(element, 'appendRequest');
      element._dropRequest(e);
      assert.deepEqual(spy.args[0][0], request);
    });
  });

  describe('_dropProject()', () => {
    let element;
    let project;
    beforeEach(async () => {
      element = await basicFixture();
      element.clearWorkspace = () => {};
      element.appendByProject = () => {};
      element._computeDropOrder = () => 3;
      project = {
        _id: 'test-id'
      };
    });

    function createEvent() {
      const e = new Event('dragend');
      e.dataTransfer = new MockedDataTransfer();
      e.dataTransfer.setData('arc/project-object', JSON.stringify(project));
      e.ctrlKey = false;
      e.metaKey = false;
      return e;
    }

    it('Calls appendByProject() with arguments', () => {
      const e = createEvent();
      const spy = sinon.spy(element, 'appendByProject');
      element._dropProject(e);
      // this implies calling `_computeDropOrder`
      assert.deepEqual(spy.args[0][0], project);
      assert.equal(spy.args[0][1], 3);
    });

    it('Calls clearWorkspace() with ctrl key', () => {
      const e = createEvent();
      e.ctrlKey = true;
      const spy = sinon.spy(element, 'clearWorkspace');
      element._dropProject(e);
      assert.isTrue(spy.args[0][0]);
    });

    it('Calls appendByProject() with ctrl key', () => {
      const e = createEvent();
      e.ctrlKey = true;
      const spy = sinon.spy(element, 'appendByProject');
      element._dropProject(e);
      assert.deepEqual(spy.args[0][0], project);
      assert.isUndefined(spy.args[0][1]);
    });
  });

  describe('_computeDropOrder()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      addRequests(element, 1);
      await nextFrame();
    });

    it('Returns requests size when no pointer reference', () => {
      const result = element._computeDropOrder();
      assert.equal(result, 1);
    });

    it('Returns requests size when reference is dom-repeat', () => {
      const node = element.shadowRoot.querySelector('dom-repeat');
      element.__dropPointerReference = node;
      const result = element._computeDropOrder();
      assert.equal(result, 1);
    });

    it('Returns reference item position', () => {
      const node = element.shadowRoot.querySelector('.tabs anypoint-tab');
      element.__dropPointerReference = node;
      const result = element._computeDropOrder();
      assert.equal(result, 0);
    });
  });

  describe('_blockEditors()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      addRequests(element, 1);
      await nextFrame();
    });

    it('Sets readOnly on the editors', () => {
      element._blockEditors();
      const node = element.shadowRoot.querySelector('request-panel');
      assert.isTrue(node.readOnly);
    });
  });

  describe('_unblockEditors()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      addRequests(element, 1);
      await nextFrame();
    });

    it('Reets readOnly on the editors', (done) => {
      const node = element.shadowRoot.querySelector('request-panel');
      node.readOnly = true;
      element._unblockEditors();
      setTimeout(() => {
        assert.isFalse(node.readOnly);
        done();
      });
    });
  });

  describe('_createDropPointer()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      addRequests(element, 2);
      await nextFrame();
    });

    it('Adds pointer to the DOM', () => {
      const node = element.shadowRoot.querySelector('.tabs anypoint-tab');
      element._createDropPointer(node);
      const pointer = element.shadowRoot.querySelector('.drop-pointer');
      assert.ok(pointer);
    });

    it('Pointer has left position', () => {
      const node = element.shadowRoot.querySelector('.tabs anypoint-tab');
      element._createDropPointer(node);
      const pointer = element.shadowRoot.querySelector('.drop-pointer');
      assert.equal(pointer.style.left, '38px');
    });
  });

  describe('_removeDropPointer()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Does nothing when __dropPointer not set', () => {
      element._removeDropPointer();
      // no error
    });

    it('Removes pointer from the DOM', () => {
      const elm = document.createElement('div');
      elm.id = 'test-elm';
      element.shadowRoot.appendChild(elm);
      element.__dropPointer = elm;
      element._removeDropPointer();
      const node = element.shadowRoot.querySelector('#test-elm');
      assert.equal(node, null);
    });
  });

  describe('_dropHandler()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element._dropRequest = () => {};
      element._dropProject = () => {};
    });

    function createEvent(type) {
      const e = {
        dataTransfer: new MockedDataTransfer(),
        defaultPrevented: false,
        preventDefault: () => {
          e.defaultPrevented = true;
        }
      };
      if (type) {
        e.dataTransfer.setData(type, 'test');
      }
      return e;
    }

    it('Does nothing when draggableEnabled not set', () => {
      element.draggableEnabled = false;
      const e = createEvent('arc/request-object');
      element._dropHandler(e);
      assert.isFalse(e.defaultPrevented);
    });

    it('Does nothing when reorder mode', () => {
      element.__reorderInfo.type = 'track';
      const e = createEvent('arc/request-object');
      element._dropHandler(e);
      assert.isFalse(e.defaultPrevented);
    });

    it('Does nothing when unsupported type', () => {
      element.__reorderInfo.type = 'track';
      const e = createEvent('arc/test');
      element._dropHandler(e);
      assert.isFalse(e.defaultPrevented);
    });

    it('Cancels the event', () => {
      const e = createEvent('arc/request-object');
      element._dropHandler(e);
      assert.isTrue(e.defaultPrevented);
    });
  });

  describe('_getReorderDdx()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element.__reorderInfo.moves.push({ x: 1, y: 2 });
    });

    it('Returns 0 when no second move', () => {
      const result = element._getReorderDdx();
      assert.equal(result, 0);
    });

    it('Returns difference between last and previous moves', () => {
      element.__reorderInfo.moves.push({ x: 3, y: 4 });
      const result = element._getReorderDdx();
      assert.equal(result, 2);
    });
  });

  describe('_updateReorderMoves()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Adds x and y position from the event', () => {
      element._updateReorderMoves({
        clientX: 1,
        clientY: 2
      });
      assert.lengthOf(element.__reorderInfo.moves, 1);
      const move = element.__reorderInfo.moves[0];
      assert.deepEqual(move, { x: 1, y: 2 });
    });
  });

  describe('_updateChildrenReorder()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      addRequests(element, 3);
      await nextFrame();
    });

    it('Adds moving class on children except for dragged item', () => {
      element._updateChildrenReorder(0, 2, 1, 0);
      const children = element.tabsElement.querySelectorAll('anypoint-tab');
      assert.isTrue(children[0].classList.contains('moving'));
      assert.isFalse(children[1].classList.contains('moving'));
      assert.isTrue(children[2].classList.contains('moving'));
    });

    it('Adds transform style on children except for dragged item', () => {
      element._updateChildrenReorder(0, 2, 1, 0);
      const children = element.tabsElement.querySelectorAll('anypoint-tab');
      assert.notEqual(children[0].style.transform.indexOf('translate3d'), -1);
      assert.equal(children[1].style.transform.indexOf('translate3d'), -1);
      assert.notEqual(children[2].style.transform.indexOf('translate3d'), -1);
    });
  });
});
