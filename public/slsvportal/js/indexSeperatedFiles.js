// import {LitElement, html,css} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { component ,html } from 'https://cdn.skypack.dev/pin/haunted@v5.0.0-FvCc6Fq9BO6lNOEjq7Jg/mode=imports/optimized/haunted.js';
import  "./indexSeperatedFiles/slsvbutton.js";
import  "./indexSeperatedFiles/slsvinput.js";
// A powerful feature of lit-html is that templates are just variables.
// You can create them anywhere, and you can define generic templates
// to be used by multiple components.



function SourceSelector  ({abc , def}){

 
    return html`
    <div>
    <slsv-input value=${def}></slsv-input>
    <slsv-button value=${abc}><slsv-button>
    </div>
    `;
  
}
SourceSelector.observedAttributes = ['abc','def'];
customElements.define("slsv-ss", component(SourceSelector));


