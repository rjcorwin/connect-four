import {LitElement, html} from '@polymer/lit-element';
import { reducer, RED_TEAM, BLUE_TEAM } from './reducer'
import { cellsToMatrix } from './helpers'
import './fiar-game'
import './p2p-dat-handshake'
import {Button} from "@material/mwc-button"
import {Switch} from '@material/mwc-switch'
import { createStore } from "redux/es/redux.js";
import '@polymer/paper-card/paper-card.js';

const MODE_NONE = 'MODE_NONE'
const MODE_SINGLE_PLAYER = 'MODE_SINGLE_PLAYER'
const MODE_HOT_SEAT = 'MODE_HOT_SEAT'
const MODE_P2P = 'MODE_P2P'
const TEAM_BLUE = 'TEAM_BLUE'
const TEAM_RED = 'TEAM_RED'

/**
 * @customElement
 * @polymer
 */
class FiarApp extends LitElement {

  static get properties() {
    return {
      mode: { type: String },
      handshakeComplete: { type: Boolean },
      p2pTeam: { type: String },
      ownArchiveUrl: { type: String },
      peerArchiveUrl: { type: String }
    }
  }

  constructor() {
    super()
    this.mode = MODE_NONE
    this.handshakeComplete = false
    if (new URL(window.location.href).searchParams.get('join')) {
      this.mode = MODE_P2P
    }
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
        .choose {
          margin-bottom: 30px;
        }
      </style>
        <paper-card>
          <div class="card-content">
            ${(this.mode === MODE_NONE) ? html`
              <h1>Four in a row!</h1>
              <div class="choose"></div>
              <mwc-button @click="${this.enableSinglePlayer}">Single Player</mwc-button><br>
              <mwc-button @click="${this.enableTwoPlayerHotSeat}">Two Player (Hot Seat)</mwc-button><br>
              <mwc-button @click="${this.enableTwoPlayerP2P}">Two Player (P2P)</mwc-button><br>
            ` : ``}
            ${(this.mode === MODE_SINGLE_PLAYER) ? html`
              <fiar-game ai-delay=1000 ai-enabled></fiar-game>
            ` : ``}
            ${(this.mode === MODE_HOT_SEAT) ? html`
              <fiar-game></fiar-game>
            ` : ``}
            ${(this.mode === MODE_P2P && this.handshakeComplete) ? html`
                <fiar-game p2p-enabled p2p-team="${this.p2pTeam}" own-archive-url="${this.ownArchiveUrl}" peer-archive-url=${this.peerArchiveUrl}"></fiar-game>
            ` : ``}
            ${(this.mode === MODE_P2P && !this.handshakeComplete) ? html`
                <p2p-dat-handshake @complete="${this._handshakeComplete}"></p2p-dat-handshake>
            ` : ``}
          </div>
        </paper-card>
    `

  }

  enableTwoPlayerHotSeat() {
    this.mode = MODE_HOT_SEAT
  }

  enableSinglePlayer() {
    this.mode = MODE_SINGLE_PLAYER
  }

  enableTwoPlayerP2P() {
    this.mode = MODE_P2P
  }

  _handshakeComplete(event) {
    this.ownArchiveUrl = event.target.ownArchiveUrl
    this.peerArchiveUrl = event.target.peerArchiveUrl
    // @TODO Quirk with LitElement? Need to setTimeout otherwise render is stale.
    setTimeout(() => { this.handshakeComplete = true},100)
  }

}

window.customElements.define('fiar-app', FiarApp);
