import { DataGenerator } from '@advanced-rest-client/arc-data-generator/arc-data-generator.js';

export const WorkspaceTestHelper = {
  wrapStateReadEvent: (element) => {
    element.addEventListener('workspace-state-read', function f(e) {
      element.removeEventListener('workspace-state-read', f);
      e.preventDefault();
      e.detail.result = Promise.resolve({});
    });
  },

  addRequests: (element, size) => {
    const requests = DataGenerator.generateRequests({
      requestsSize: size || 2
    });
    for (let i = 0; i < requests.length; i++) {
      requests[i].name = 'Test request name #' + i;
      element.__addPanel(requests[i]);
    }
    element.activeRequests = requests;
  }
};
