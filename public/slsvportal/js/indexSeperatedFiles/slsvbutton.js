// import {LitElement, html,css} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { component ,html } from 'https://cdn.skypack.dev/pin/haunted@v5.0.0-FvCc6Fq9BO6lNOEjq7Jg/mode=imports/optimized/haunted.js';
// A powerful feature of lit-html is that templates are just variables.
// You can create them anywhere, and you can define generic templates
// to be used by multiple components.
function SlsvButton({value}){
    return html`
    <style>
    #btn {
      margin: 20px;
      padding: 20px;
      text-align: center;
      cursor: pointer;
    }
    </style>
    <link rel="stylesheet" href="http://localhost:3010/slsvportal/assets/css/main.css">
    <input id="btn" type="button"  class="slsv-button" value=${value}>
    </input>
    `;
  
}
SlsvButton.observedAttributes = ['value'];
customElements.define("old-button", component(SlsvButton));