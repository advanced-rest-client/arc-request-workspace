[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/arc-request-workspace.svg)](https://www.npmjs.com/package/@advanced-rest-client/arc-request-workspace)

[![Build Status](https://travis-ci.org/advanced-rest-client/arc-request-workspace.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/arc-request-workspace)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/arc-request-workspace)

# arc-request-workspace

A request workspace component for Advanced REST Client. It is a top level component for ARC to render request editor view.

## Usage

### Installation
```
npm install --save @advanced-rest-client/arc-request-workspace
```

### In an html file

```html
<html>
  <head>
    <script type="module">
      import './node_modules/@advanced-rest-client/arc-request-workspace/arc-request-workspace.js';
    </script>
  </head>
  <body>
    <arc-request-workspace></arc-request-workspace>
  </body>
</html>
```

### In a LitElement

```javascript
import { LitElement, html } from 'lit-element';
import '@advanced-rest-client/arc-request-workspace/arc-request-workspace.js';

class SampleElement extends LitElement {
  render() {
    return html`
    <arc-request-workspace
      ?compatibility="${compatibility}"
      ?outlined="${outlined}"
      ?narrow="${narrow}"
      .oauth2RedirectUri="${oauth2RedirectUri}"
      .sentMessageLimit="${sentMessageLimit}"
      .requestTimeout="${requestTimeout}"
      ?validateCertificates="${validateCertificates}"
      ?ignoreContentOnGet="${ignoreContentOnGet}"
      ?followRedirects="${followRedirects}"
      draggableenabled
    ></arc-request-workspace>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

### Workspace state events

The element dispatches `workspace-state-read` custom event to request for workspace data
and `workspace-state-store` to request to store the data in a store.

Data to be stored and later on restored are under `value` property of `workspace-state-store` event's detail object.
The data may contain huge amount of data as it stores list of requests with responses. Some storage solutions may not be adequate
to store such amount of data.

#### Example implementation

```javascript
window.addEventListener('workspace-state-read', (e) => {
  e.preventDefault();
  e.detail.result = new Promise((resolve) => {
    let data = localStorage.getItem('workspace.state');
    if (data) {
      data = JSON.parse(data)
    }
    resolve(data);
  });
});
window.addEventListener('workspace-state-store', (e) => {
  localStorage.setItem('workspace.state', JSON.stringify(e.detail.value));
});
```

## Development

```sh
git clone https://github.com/advanced-rest-client/arc-request-workspace
cd arc-request-workspace
npm install
```

## Running the demo locally

```sh
npm start
```

### Running the tests
```sh
npm test
```

## API components

This components is a part of [API components ecosystem](https://elements.advancedrestclient.com/)
