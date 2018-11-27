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
      baseUrl: { type: String },
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

  async connectedCallback() {
    super.connectedCallback()
    const joinParam = new URL(window.location.href).searchParams.get('join')
    const joinKeys = joinParam ? joinParam.split(',') : []
    // @TODO Why do I have to do this? I thought LitElement would have taken care of it.
    this.baseUrl = this.hasAttribute('base-url') ? this.getAttribute('base-url') : window.location.origin
    if (joinKeys.length == 0) {
      this.inProgress = false
    } else if (joinKeys.length == 1) {
      this.inProgress = true
      this.peerArchiveUrl = joinKeys[0]
      this.initializeOwnArchive()
    } else if (joinKeys.length == 2) {
      const archive1 = new DatArchive(joinKeys[0])
      const archive2 = new DatArchive(joinKeys[1])
      const archive1Info = await archive1.getInfo()
      const archive2Info = await archive2.getInfo()
      if (!archive1Info.isOwner && !archive2Info.isOwner) {
        return alert('You are not owner of archives in this handshake. This URL must not be for you.')
      }
      this.inProgress = true
      if (archive1Info.isOwner) {
        this.ownArchiveUrl = joinKeys[0]
        this.peerArchiveUrl = joinKeys[1]
      } else {
        this.ownArchiveUrl = joinKeys[1]
        this.peerArchiveUrl = joinKeys[0]
      }
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

  cancel() {
    this.dispatchEvent(new CustomEvent('exit'))
  }

  copyToClipboard() {
    this.shadowRoot.querySelector('textarea').select()
    document.execCommand('copy');
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

      ${(this.askingForPermission) ? html`
        <div class="shake-icon">👋</div>
        <div class="allow">
          ^ click allow to generate handshake URL
        </div>
      `:``}
      ${(!this.inProgress) ? html`
        <div class="shake-icon">👋</div>
        <div class="directions">
          You are about to generate a handshake URL with a friend.<br>
          Ready? <br>
          <mwc-button @click="${this.startHandShake}">start</mwc-button>
          or
          <mwc-button @click="${this.cancel}">cancel</mwc-button>
        </div>
      ` : ``}
      ${(this.inProgress && this.ownArchiveUrl && !this.peerArchiveUrl) ? html`
        <div class="shake-icon">👋</div>
        <div class="send-it">
          Share this URL to start the handshake:<br>
          <textarea rows=5>${this.baseUrl}${window.location.pathname}?join=${this.ownArchiveUrl}</textarea><br>
          <mwc-button @click="${this.copyToClipboard}">copy to clipboard</mwc-button>
        </div>
      ` : ``}
      ${(this.inProgress && this.ownArchiveUrl && this.peerArchiveUrl) ? html`
        <div class="shake-icon">🤝</div>
        <div class="send-it">
          You've created a handshake URL! Share it back and then open it.<br>
          <textarea rows=5>${this.baseUrl}${window.location.pathname}?join=${this.peerArchiveUrl},${this.ownArchiveUrl}</textarea>
          <mwc-button @click="${this.copyToClipboard}">copy to clipboard</mwc-button>
          <br>
          <!-- TODO: When connected, peer adds greeting and we detect that to proceed. -->
        </div>
      ` : ``}
    `

  }

}

window.customElements.define('p2p-dat-handshake', P2pDatHandshake);
