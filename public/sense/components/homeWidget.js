import {LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import  '../../vocables/modules/uiWidgets/js/basicComponents.js';


/**
 * ***********************************************************************
 *  Widget >Description
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * @type {{}}
 */


/**
 * ***************************************************************************************
 * WebComponent
 *
 *
 *
 * @type {{}}
 */


class Widget extends LitElement {
    static properties = {
        title: { type: String, reflect: true },
        classWidget: { type: String, reflect: true },
        widgetId: { type: String, reflect: true },
      };
      constructor() {
        super();
        this.title = "";
        this.classWidget = "";
        this.widgetId = "";
        this.attachShadow({ mode: 'open' });
    }
  
    render() {
      return html`
        <div class="widget">
          <p>${this.title}</p>
          <slsv-button btnId="${this.widgetId}" btnClass="${this.classWidget}" value="${this.title}" @click="${this.navigateTo}"></slsv-button>
        </div>
      `;
    }
  
    navigateTo() {
      window.location.href = this.target;
    }
  }
  
customElements.define('slsv-widget', Widget);

/**
 * **********************************************************************************************
 * Business logic
 *
 *
 *
 * @type {{}}
 */