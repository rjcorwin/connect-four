import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import { reducer, cellsToGrid, RED_TEAM, BLUE_TEAM } from '../reducer'
import './go-cell'
import './go-reset'
import './play-jerry'
import './stop-jerry'
import { jerry } from '../jerry.js'

/**
 * @customElement
 * @polymer
 */
class GoPolymerApp extends PolymerElement {
  static get template() {
    return html`

    `;
  }
  static get properties() {
    return {
      hasOpponent: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      opponentDelay: {
        type: Number,
        value: 0
      }
    };
  }

  connectedCallback() {
    super.connectedCallback()
    this.store = Redux.createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
    this.store.subscribe(() => this.render())
    this.store.dispatch({type: 'start', size: 12})
    this.shadowRoot.addEventListener('go-reset-click', (event) => {
      this.store.dispatch({type: 'start', size: 12})
    })
    this.shadowRoot.addEventListener('go-cell-click', (event) => {
      if (!this.store.getState().winner) {
        this.store.dispatch({type: 'drop', columnNumber: event.target.column})
      }
    })
    this.shadowRoot.addEventListener('play-jerry-click', (event) => { this.hasOpponent = true; this.render(); })
    this.shadowRoot.addEventListener('stop-jerry-click', (event) => { this.hasOpponent = false; this.render(); })
  }

  render() {
    const state = this.store.getState()
    const grid = cellsToGrid(state.cells).reverse()
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: span;
          margin: 0 auto;
        }
        :host([has-opponent]) play-jerry {
          display: none;
        }
        :host(:not([has-opponent])) stop-jerry {
          display:none;
        }
      </style>
      <table>
       ${grid.map((row, rowNumber) => `
         <tr>
           ${row.map((fill, columnNumber) => `
             <td>
               <go-cell column=${columnNumber} row=${rowNumber} fill="${fill}"></go-cell>
             </td>
          `).join('')}
         </tr>
       `).join('')}
      </table>
      ${(state.turn && !state.winner) ? `
        <div class="turn">
          GO ${state.turn}
        </div>
      ` : ``}
      ${state.winner ? `
        <div class="winner">
          ${state.winner} wins!
        </div>
      ` : ``}
      <go-reset></go-reset>
      <play-jerry></play-jerry>
      <stop-jerry></stop-jerry>
    `
    if (this.hasOpponent && state.turn === RED_TEAM && !state.winner) {
      if (this.opponentDelay > 0) {
        setTimeout(() => this.store.dispatch({type: 'drop', columnNumber: jerry(state)}), this.opponentDelay)
      } else {
        this.store.dispatch({type: 'drop', columnNumber: jerry(state)})
      }
    }
  }

}

window.customElements.define('go-polymer-app', GoPolymerApp);
