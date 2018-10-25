import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {Switch} from '@material/mwc-switch'

/**
 * @customElement
 * @polymer
 */
class StopJerry extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <mwc-switch checked></mwc-switch> AI
    `;
  }
  static get properties() {
    return {

    };
  }

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener('click', () => this.dispatchEvent(new CustomEvent('stop-jerry-click', {bubbles: true})))
  }

}

window.customElements.define('stop-jerry', StopJerry);
