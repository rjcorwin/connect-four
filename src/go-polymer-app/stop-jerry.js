import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

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
          background: black;
          color: white;
          padding: 15px;
          margin: 15px;
          font-size: 3em;
        }
      </style>
      _____ON AI
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
