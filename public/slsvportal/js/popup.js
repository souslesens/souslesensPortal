import { component, html, useState } from 'https://cdn.skypack.dev/haunted';
const PopUp = () => {
    const [isOpen, setOpen] = useState(true);
  
    return isOpen ? html`
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;">
        <div style="background: #fff; padding: 1rem;">
          <p>Popup Content Here</p>
          <button @click=${() => setOpen(false)}>Close</button>
        </div>
      </div>
    ` : html``;
  };
  customElements.define('my-popup', component(PopUp));