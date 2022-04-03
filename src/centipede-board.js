
import { createStore } from "redux/es/redux.js";

class CentipedeBoard extends HtmlElement {
  static get template() {
    return html`
      <style>
      </style>
      <div id="container"></div>
    `;
  }

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener('click', () => this.dispatchEvent(new CustomEvent('fiar-cell-click', {bubbles: true})))
  }

}

window.customElements.define('centipede-board', CentipedeBoard);
