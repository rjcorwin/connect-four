import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import { reducer, RED_TEAM, BLUE_TEAM } from './reducer'
import { cellsToMatrix } from './helpers'
import './fiar-cell'
import { ai } from './ai'
import {Button} from "@material/mwc-button"
import {Switch} from '@material/mwc-switch'
import { createStore } from "redux/es/redux.js";

/**
 * @customElement
 * @polymer
 */
class FiarApp extends PolymerElement {
  static get template() {
    return html`...`;
  }
  static get properties() {
    return {
      aiEnabled: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      aiDelay: {
        type: Number,
        value: 0
      }
    };
  }

  connectedCallback() {
    super.connectedCallback()
    this.store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
    this.store.subscribe(() => this.render())
    this.store.dispatch({type: 'START', size: 7})
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
      <div id="reset">
        <mwc-button class="light" raised="" label="reset" icon="refresh"></mwc-button>
      </div>
      <div id="ai-switch">
        <mwc-switch ${this.aiEnabled ? `checked` : ``}></mwc-switch> AI
      </div>
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
    // Listen for turning ai on and off.
    this.shadowRoot.querySelector('#ai-switch').addEventListener('click', (event) => {
      if (!this.aiTakingTurn) {
        this.aiEnabled = !event.target.checked
        if (state.turn === RED_TEAM) this.aiTurn()
      }
    }, {once: true})
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

window.customElements.define('fiar-app', FiarApp);
