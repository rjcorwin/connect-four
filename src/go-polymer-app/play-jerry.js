import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {Switch} from '@material/mwc-switch'

/**
 * @customElement
 * @polymer
 */
class PlayJerry extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <mwc-switch></mwc-switch> Play against Jerry the Robot <br>
      <img src="jerry-the-robot.png"/>
    `;
  }
  static get properties() {
    return {

    };
  }

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener('click', () => this.dispatchEvent(new CustomEvent('play-jerry-click', {bubbles: true})))
  }

}

window.customElements.define('play-jerry', PlayJerry);
