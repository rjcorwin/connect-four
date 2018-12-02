import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import { reducer, RED_TEAM, BLUE_TEAM } from './reducer'
import { cellsToMatrix } from './helpers'
import './fiar-cell'
import { ai } from './ai'
import {Button} from "@material/mwc-button"
import { createStore } from "redux/es/redux.js";
import { createStore as createReduxDatStore } from "redux-dat/redux-dat.js"

/**
 * @customElement
 * @polymer
 */
class FiarGame extends PolymerElement {
  static get template() {
    return html`Loading...`;
  }
  static get properties() {
    return {
      p2pEnabled: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      aiEnabled: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      aiDelay: {
        type: Number,
        value: 0
      },
      peerArchiveUrl: {
        type: String,
        value: '',
        reflectToAttribute: true
      },
      ownArchiveUrl: {
        type: String,
        value: '',
        reflectToAttribute: true
      }
    };
  }

  constructor() {
    super()
    this._previousState = {}
  }

  connectedCallback() {
    super.connectedCallback()
    if (!this.p2pEnabled) {
      this.store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
      this.store.subscribe(() => this.render())
      this.store.dispatch({type: 'START', size: 7})
    } else {
      this.store = createReduxDatStore(reducer, {}, `dat://${this.ownArchiveUrl}`, [`dat://${this.peerArchiveUrl}`])
      this.store.subscribe(() => this.render())
      // @TODO: Temporary fix for "DatArchive.watch may not be ready by the time you DatArchive.write #77" https://github.com/bunsenbrowser/bunsen/issues/77
      setTimeout(() => {
        this.store.dispatch({type: 'START', size: 7})
      }, 3000)
    }
  }

  render() {
    const state = this.store.getState()
    const grid = cellsToMatrix(state.cells).reverse()
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin: 0 auto;
          text-align: center;
        }
        #game {
          background: yellow;
          padding: 15px;
          border-radius: 10px;
          border-width: 5px;
          border-color: darkkhaki;
          border-style: solid;
          margin: auto;
          width: 380px;
        }
        #winner {
          padding: 12px 0px;
          margin: 5px 15px;
        }
        #turn {
          padding: 15px;
          text-align:center;
          width: 100%;
        }
        #reset {
          margin: 15px;
        }
      </style>
      <paper-card>
        <div class="card-content">
          ${(state.turn && !state.winner) ? `
            <div id="turn" style="color: ${state.turn === BLUE_TEAM ? `blue` : `red` };">
              Go ${state.turn === BLUE_TEAM ? `Blue Team` : `Red Team` }
            </div>
          ` : ``}
          ${state.winner ? `
            <div id="winner" style="font-weight: bolder; color: ${state.winner === BLUE_TEAM ? `blue` : `red` };">
              ${state.winner === BLUE_TEAM ? `Blue Team` : `Red Team` } wins!
            </div>
          ` : ``}
          <table id="game">
           ${grid.map((row, rowNumber) => `
             <tr>
               ${row.map((fill, columnNumber) => `
                 <td>
                   <fiar-cell column=${columnNumber} row=${rowNumber} fill="${fill}"></fiar-cell>
                 </td>
              `).join('')}
             </tr>
           `).join('')}
          </table>
        </div>
        <div class="card-actions">
          <mwc-button id="reset" label="reset" icon="refresh"></mwc-button>
          <mwc-button id="exit" label="exit" icon="logout"></mwc-button>
        </div>
      </paper-card>
    `
    this.shadowRoot.querySelector('#game').addEventListener('fiar-cell-click', (event) => {
      if (!this.store.getState().winner && !this.aiTakingTurn) {
        this.store.dispatch({type: 'DROP', columnNumber: event.target.column})
        if (!this.store.getState().winner && this.aiEnabled && this.store.getState().turn === RED_TEAM) {
          this.aiTurn()
        }
      }
    }, {once: true})
    this.shadowRoot.querySelector('#reset').addEventListener('click', (event) => {
      if (!this.aiTakingTurn) {
        this.store.dispatch({type: 'START', size: 7})
      }
    }, {once: true})
    this.shadowRoot.querySelector('#exit').addEventListener('click', (event) => {
      this.dispatchEvent(new CustomEvent('exit'))
    }, {once: true})
    if (!this._previousState.winner && state.winner) {
      new Audio('tada.wav').play()
    }
    if (this._previousState.cells) {
      const previousNumberOfTurns = this._previousState.cells.reduce((acc, cell) => cell.fill ? acc+1 : acc, 0)
      const currentNumberOfTurns = state.cells.reduce((acc, cell) => cell.fill ? acc+1 : acc, 0)
      if (previousNumberOfTurns < currentNumberOfTurns) new Audio('tick.wav').play()
    }
    this._previousState = state
  }

  aiTurn() {
    if (this.aiDelay > 0) {
      this.aiTakingTurn = true
      setTimeout(() => {
        this.store.dispatch({type: 'DROP', columnNumber: ai(this.store.getState())}), this.aiDelay
        this.aiTakingTurn = false
      }, this.aiDelay)
    } else {
      this.store.dispatch({type: 'DROP', columnNumber: ai(this.store.getState())})
    }
  }

}

window.customElements.define('fiar-game', FiarGame);
