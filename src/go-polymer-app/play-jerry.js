import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

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
          background: green;
          padding: 15px;
          margin: 15px;
          font-size: 3em;
        }
      </style>
      OFF____ AI
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
