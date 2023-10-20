import {LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';



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
      };
      constructor() {
        super();
        this.title = "";

        this.attachShadow({ mode: 'open' });
    }
  
    render() {
      return html`
        <div class="widget">
          <p>${this.title}</p>
          <button @click="${this.navigateTo}">Go to ${this.title}</button>
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