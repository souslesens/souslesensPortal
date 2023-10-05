
// import {LitElement, html,css} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { component,html } from 'https://cdn.skypack.dev/pin/haunted@v5.0.0-FvCc6Fq9BO6lNOEjq7Jg/mode=imports/optimized/haunted.js';
// A powerful feature of lit-html is that templates are just variables.
// You can create them anywhere, and you can define generic templates
// to be used by multiple components.
function SlsvInput ({value}){

    return html`
    <link rel="stylesheet" href="http://localhost:3010/vocables/css/main.css">
    <input class="slsv-input" value=${value}>
    </input>
    `;
  
}
SlsvInput.observedAttributes = ['value'];
customElements.define("slsv-input", component(SlsvInput));