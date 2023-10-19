import {LitElement, html,css} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import SourceSelectorWidget from "../sourceSelectorWidget.js";


class SlsvButton extends LitElement {
  static properties = {
    value: { type: String, reflect: true },
    action: { type: String, reflect: true },
    btnId: { type: String, reflect: true },
    btnClass: { type: String, reflect: true }
  };
  constructor() {
    super();
    this.value = "";
    this.action = "";
    this.btnId = "";
    this.btnClass = "";
    this.attachShadow({ mode: 'open' });
}
closeDialog() {
  const sourceSelector = $("#sourceSelector");
  if (sourceSelector.dialog) {
    sourceSelector.dialog("close");
  }
}

customAction(){
  console.log("exec custom action");
}

handleAction() {
  switch(this.action) {
    case "close":
      this.closeDialog();
      break;
    case "custom":
      // this.closeDialog();
      break;
    default:
      console.warn(`Unknown action: ${this.action}`);
  }
}

firstUpdated() {
  super.firstUpdated();
  // var shadowDom=this.renderRoot.querySelector('#sourceSelector');
  // $("#mainDialogDiv").html(shadowDom);

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
    <link rel="stylesheet" href="../../vocables/css/slsv-components.css">
    <button id="${this.btnId}" @click="${this.handleAction}" class="${this.btnClass}">${this.value}</button>
    </input>
    `;
  
}
}
{/* <input id="${this.btnId} type="button"  .value="${this.value}" @click="${this.handleAction}"  class="${this.btnClass}> */}
customElements.define("slsv-button", SlsvButton);


class SlsvInput extends LitElement {
  static properties = {
    value: { type: String, reflect: true },
    inputId: { type: String, reflect: true },
    inputClass: { type: String, reflect: true },
    inputAuto: { type: String, reflect: true },
    required: { type: Boolean , reflect:true}
  };
  constructor() {
    super();
    this.value = "";
    this.inputId= "";
    this.inputClass= "";
    this.inputAuto="off";
    this.required=false;
    this.attachShadow({ mode: 'open' });
}

    render(){
    return html`
    <link rel="stylesheet" href="../../vocables/css/slsv-components.css">
    <input class="${this.inputClass}" id="${this.inputId}" .value="${this.value}" autocomplete="${this.inputAuto}" required="${this.required}">
    </input>
    `;
  
}
}
customElements.define("slsv-input", SlsvInput);