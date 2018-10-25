import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import { reducer, cellsToGrid, RED_TEAM, BLUE_TEAM } from '../reducer'

/**
 * @customElement
 * @polymer
 */
class GoCell extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          background: #BBB;
          width: 40px;
          height: 40px;
          border-radius: 20px;
          border-color: yellow;
          font-size: 3em;
        }
        :host([fill="RED_TEAM"]) {
          background: red;
        }
        :host([fill="BLUE_TEAM"]) {
          background: blue;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      fill: {
        type: String,
        value: null
      },
      row: {
        type: Number,
        value: null,
      },
      column: {
        type: Number,
        value: null
      }
    };
  }

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener('click', () => this.dispatchEvent(new CustomEvent('go-cell-click', {bubbles: true})))
  }

}

window.customElements.define('go-cell', GoCell);
