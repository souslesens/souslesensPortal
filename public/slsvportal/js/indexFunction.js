// import {LitElement, html,css} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { component, html } from 'https://cdn.skypack.dev/pin/haunted@v5.0.0-FvCc6Fq9BO6lNOEjq7Jg/mode=imports/optimized/haunted.js';
// A powerful feature of lit-html is that templates are just variables.
// You can create them anywhere, and you can define generic templates
// to be used by multiple components.

// HAUNTED WEB COMPONENT

function SourceSelector  (){

 
    return html`
    <div>
    <slsv-input></slsv-input>
    <slsv-button><slsv-button>
    </div>
    `;
  
}

customElements.define("slsv-ss", component(SourceSelector));

function SlsvButton(){
    return html`
    <link rel="stylesheet" href="http://localhost:3010/vocables/css/main.css">
    <input type="button" value="Lineage" class="slsv-button">
    </input>
    `;
  
}

customElements.define("slsv-button", component(SlsvButton));

function SlsvInput (){

    return html`
    <link rel="stylesheet" href="http://localhost:3010/vocables/css/main.css">
    <input class="slsv-input">
    </input>
    `;
  
}

customElements.define("slsv-input", component(SlsvInput));