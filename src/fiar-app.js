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
      baseUrl: { type: String },
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
    fetch('config.json')
      .then(response => response.json())
      .then(config => Object.assign(this, { baseUrl: config.baseUrl }))
      .catch(e => e)
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
        .left {
          float: left;
        }
        .right {
          float: right;
        }
        h1 fiar-cell {
          margin: 15px;
          position: relative;
          bottom: 20px;
        }
      </style>

      ${(this.mode === MODE_NONE) ? html`
        <paper-card>
          <div class="card-content">
            <h1>
              <fiar-cell fill="BLUE_TEAM" class="left"></fiar-cell>
              Four in a row!
              <fiar-cell fill="RED_TEAM"  class="right"></fiar-cell>
            </h1>
            <div class="choose">
              <mwc-button @click="${this.enableSinglePlayer}">Single Player</mwc-button><br>
              <mwc-button @click="${this.enableTwoPlayerHotSeat}">Two Player (Hot Seat)</mwc-button><br>
              <mwc-button @click="${this.enableTwoPlayerP2P}">Two Player (P2P)</mwc-button><br>
            </div>
          </div>
        </paper-card>
      ` : ``}
      ${(this.mode === MODE_SINGLE_PLAYER) ? html`
        <fiar-game @exit="${this.exit}" ai-delay=1000 ai-enabled></fiar-game>
      ` : ``}
      ${(this.mode === MODE_HOT_SEAT) ? html`
        <fiar-game @exit="${this.exit}"></fiar-game>
      ` : ``}
      ${(this.mode === MODE_P2P && this.handshakeComplete) ? html`
        <fiar-game @exit="${this.exit}" p2p-enabled p2p-team="${this.p2pTeam}" own-archive-url="${this.ownArchiveUrl}" peer-archive-url="${this.peerArchiveUrl}"></fiar-game>
      ` : ``}
      ${(this.mode === MODE_P2P && !this.handshakeComplete) ? html`
        <p2p-dat-handshake @exit="${this.exit}" @complete="${this._handshakeComplete}" base-url="${this.baseUrl}"></p2p-dat-handshake>
      ` : ``}
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

  exit() {
    this.mode = MODE_NONE
    // Remove join params so they don't end up getting used again when enabling P2P mode.
    if (window.location.search !== '') {
      window.location.search = ''
    }
  }

  _handshakeComplete(event) {
    this.ownArchiveUrl = event.target.ownArchiveUrl
    this.peerArchiveUrl = event.target.peerArchiveUrl
    // @TODO Quirk with LitElement? Need to setTimeout otherwise render is stale.
    setTimeout(() => { this.handshakeComplete = true},100)
  }

}

window.customElements.define('fiar-app', FiarApp);
