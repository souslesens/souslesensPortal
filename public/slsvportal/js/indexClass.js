import {LitElement, html,css} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

// A powerful feature of lit-html is that templates are just variables.
// You can create them anywhere, and you can define generic templates
// to be used by multiple components.

// Lit-Html  WEB COMPONENT

class SourceSelector extends LitElement {

  render() {
    return html`
    <div>
    <slsv-input></slsv-input>
    <slsv-button><slsv-button>
    </div>
    `;
  }
}

customElements.define("slsv-ss", SourceSelector);

class SlsvButton extends LitElement {
    constructor() {
        super();
      //  this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }
    getAttributes(){
        return this.getAttributes('abc') || 'Default Button Text';  
    }
  render() {
    return html`
    <link rel="stylesheet" href="http://localhost:3010/vocables/css/main.css">
    <input type="button" value="${this.abc}" class="slsv-button">
    </input>
    `;
  }
}

customElements.define("slsv-button", SlsvButton);

class SlsvInput extends LitElement {

  render() {
    return html`
    <link rel="stylesheet" href="http://localhost:3010/vocables/css/main.css">
    <input class="slsv-input">
    </input>
    `;
  }
}

customElements.define("slsv-input", SlsvInput);