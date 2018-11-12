import {LitElement, html} from '@polymer/lit-element';
import { reducer, RED_TEAM, BLUE_TEAM } from './reducer'
import { cellsToMatrix } from './helpers'
import './fiar-game'
import {Button} from "@material/mwc-button"
import {Switch} from '@material/mwc-switch'
import { createStore } from "redux/es/redux.js";
import '@polymer/paper-card/paper-card.js';

/**
 * @customElement
 * @polymer
 */
class P2pDatHandshake extends LitElement {

  static get properties() {
    return {
      ownArchiveUrl: { type: String },
      inProgress: { type: String },
      askingForPermission: { type: String },
      peerArchiveUrl: { type: String }
    };
  }

  constructor() {
    super()
    this.mode
    this.inProgress = false
  }

  connectedCallback() {
    super.connectedCallback()
    const joinParam = new URL(window.location.href).searchParams.get('join')
    const joinKeys = joinParam ? joinParam.split(',') : []
    if (joinKeys.length == 0) {
      this.inProgress = false
    } else if (joinKeys.length == 1) {
      this.inProgress = true
      this.peerArchiveUrl = joinKeys[0]
      this.initializeOwnArchive()
    } else if (joinKeys.length == 2) {
      this.inProgress = true
      this.ownArchiveUrl = joinKeys[0]
      this.peerArchiveUrl = joinKeys[1]
      this.dispatchEvent(new CustomEvent('complete'))
    }
  }

  async initializeOwnArchive() {
    this.askingForPermission = true
    const ownArchive = await DatArchive.create({
      title: 'fiar-app',
      description: '',
      prompt: false
    })
    await ownArchive.writeFile('actions.json', '[]')
    this.askingForPermission = false
    this.ownArchiveUrl = ownArchive.url.replace('dat:\/\/', '')
  }

  startHandShake() {
    this.inProgress = true
    this.initializeOwnArchive()
  }

  render() {
    return html`
      <style>
        :host {
          display: block;
          margin: 0 auto;
          text-align: center;
        }
        mwc-button {
          margin: 15px;
        }
        .shake-icon {
          font-size: 6em;
        }
        .send-it {
          width: 100%;
          font-size: 2em;
        }
        .send-it input {
          width: 100%;
          font-size: 1.5em;
        }
        .allow, .directions {
          font-size: 2em;
        }
      </style>

      <div class="shake-icon">🤝</div>
      ${(this.askingForPermission) ? html`
        <div class="allow">
          ^ click allow to generate handshake URL
        </div>
      `:``}
      ${(!this.inProgress) ? html`
        <div class="directions">
          You are about to start a Digital Handshake where you and a friend send URLs back and forth.
          Ready? <mwc-button @click="${this.startHandShake}">start handshake</mwc-button>
        </div>
      ` : ``}
      ${(this.inProgress && this.ownArchiveUrl && !this.peerArchiveUrl) ? html`
        <div class="send-it">
          Share this URL to start the handshake:<br>
          <input value="${window.location.href}?join=${this.ownArchiveUrl}"></input><br>
        </div>
      ` : ``}
      ${(this.inProgress && this.ownArchiveUrl && this.peerArchiveUrl) ? html`
        <div class="send-it">
          You've created a handshake URL! Share it back.<br>
          <input value="${window.location.origin}${window.location.pathname}?join=${this.peerArchiveUrl},${this.ownArchiveUrl}"></input>
          <br><br>
          <!-- TODO: When connected, peer adds greeting and we detect that to proceed. -->
          <mwc-button><a href="${window.location.origin}${window.location.pathname}?join=${this.peerArchiveUrl},${this.ownArchiveUrl}">Click to continue</a>
        </div>
      ` : ``}
    `

  }

}

window.customElements.define('p2p-dat-handshake', P2pDatHandshake);
