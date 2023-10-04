// html and component are the basic required imports
import { html } from "https://cdn.jsdelivr.net/npm/lit-html@2.8.0/lit-html.min.js";
import { component, useState } from 'https://cdn.skypack.dev/pin/haunted@v5.0.0-FvCc6Fq9BO6lNOEjq7Jg/mode=imports/optimized/haunted.js';
import "./button.js" ;
import "./input.js" ;
// Create your functional component, and return a lit-html TemplateResult
function sourceSelector() {
  // create the DOM elements

  
  return html`
  <link rel="stylesheet" href="http://localhost:3010/vocables/css/main.css">
  <slot></slot>
  `;
}

// Register your element to custom elements registry, pass it a tag name and your class definition
// Note how we're wrapping our function in a `component()` function
// The element name must always contain at least one dash
customElements.define("slsv-sourceSelector", component(sourceSelector));
