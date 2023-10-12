import { component, html , useState} from 'https://cdn.skypack.dev/pin/haunted@v5.0.0-FvCc6Fq9BO6lNOEjq7Jg/mode=imports/optimized/haunted.js';
import  "./indexSeperatedFiles/slsvbutton.js";
import  "./indexSeperatedFiles/slsvinput.js";
import "../../vocables/modules/uiWidgets/sourceSelectorWidget.js"
// Create your functional component, and return a lit-html TemplateResult
function sourceSelector({abc,cancel}) {
  // create the DOM elements
//   const PopUp = () => {
//     const [isOpen, setOpen] = useState(true);
//     return isOpen ? html`
//     <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;">
//       <div style="background: #fff; padding: 1rem;">
//         <p>Popup Content Here</p>
//         <slsv-button value="Close Popup" @click=${() => setOpen(false)}></slsv-button>
//       </div>
//     </div>
//   ` : html`<slsv-button value="Open" @click=${() => setOpen(true)}></slsv-button>`;
// };
// customElements.define('my-popup', component(PopUp));
  const handleClick = () => {
    alert('../../vocables/snippets/sourceSelector.html')
    
  };
  return html`
  <link rel="stylesheet" href="http://localhost:3010/slsvportal/assets/css/main.css">
  <div id="sourceSelector" style="margin-bottom: 10px; width: auto; min-height: 0px; max-height: none; height: 680px">
  <div class="sourceSelector_buttons">
      <button class="btn btn-sm my-1 py-0 btn-outline-primary" onclick="$('#sourceSelector').dialog('close')">Cancel</button>
      <button class="btn btn-sm my-1 py-0 btn-outline-primary" id="sourceSelector_validateButton">OK</button>
  </div>
  <div>Search : <input id="sourceSelector_searchInput" value="" autocomplete="off" style="width: 200px; font-size: 12px; margin: 3px; padding: 3px" /></div>

  <div class="jstreeContainer" style="width: 360px; height: 600px; overflow: auto; margin-top: 5px">
      <div id="sourceSelector_jstreeDiv"></div>
  </div>
</div>

  
  `;

  
}
sourceSelector.observedAttributes = ['abc','cancel'];
// Register your element to custom elements registry, pass it a tag name and your class definition
// Note how we're wrapping our function in a `component()` function
// The element name must always contain at least one dash
customElements.define("slsv-source-selector", component(sourceSelector));
