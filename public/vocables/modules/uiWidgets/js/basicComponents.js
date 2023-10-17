import {LitElement, html,css} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';



class SlsvButton extends LitElement {
  static properties = {
    value: { type: String, reflect: true }
  };
  constructor() {
    super();
    this.value = "";
    this.attachShadow({ mode: 'open' });
}
 
    render(){
    return html`
    <style>
    #btn {
      margin: 20px;
      padding: 20px;
      text-align: center;
      cursor: pointer;
    }
    </style>
    <link rel="stylesheet" href="../../css/slsv-components.css">
    <input id="btn" type="button"  .value="${this.value}" class="slsv-skin">
    </input>
    `;
  
}
}
customElements.define("slsv-button", SlsvButton);


class SlsvInput extends LitElement {
  static properties = {
    value: { type: String, reflect: true }
  };
  constructor() {
    super();
    this.value = "";
    this.attachShadow({ mode: 'open' });
}

createRenderRoot() {
  return this;
} 
    render(){
    return html`
    <link rel="stylesheet" href="../../css/slsv-components.css">
    <input class="slsv-input" .value="${this.value}">
    </input>
    `;
  
}
}
customElements.define("slsv-input", SlsvInput);