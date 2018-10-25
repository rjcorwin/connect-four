import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import { reducer, cellsToGrid, RED_TEAM, BLUE_TEAM } from '../reducer'

/**
 * @customElement
 * @polymer
 */
class GoReset extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          background: black;
          color: white;
          padding: 15px;
          margin: 15px;
          font-size: 3em;
        }
      </style>
      RESET
    `;
  }
  static get properties() {
    return {

    };
  }

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener('click', () => this.dispatchEvent(new CustomEvent('go-reset-click', {bubbles: true})))
  }

}

window.customElements.define('go-reset', GoReset);
