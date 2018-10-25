import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import { reducer, cellsToGrid, RED_TEAM, BLUE_TEAM } from '../reducer'
import './go-cell'
import './go-reset'

/**
 * @customElement
 * @polymer
 */
class GoPolymerApp extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        .winner {
          background: yellow;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'go-polymer-app'
      }
    };
  }

  connectedCallback() {
    super.connectedCallback()
    this.store = Redux.createStore(reducer)
    this.store.subscribe(() => this.render())
    this.store.dispatch({type: 'start', columns: 18, rows: 8})
    this.shadowRoot.addEventListener('go-reset-click', (event) => {
      this.store.dispatch({type: 'start', columns: 12, rows: 8})
    })
    this.shadowRoot.addEventListener('go-cell-click', (event) => {
      if (!this.store.getState().winner) {
        this.store.dispatch({type: 'drop', columnNumber: event.target.column})
      }
    })
  }

  render() {
    const state = this.store.getState()
    const grid = cellsToGrid(state.cells).reverse()
    this.shadowRoot.innerHTML = `
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
      ${state.winner ? `
        <div class="winner">
          ${state.winner} wins!
        </div>
      ` : ``}
      <go-reset></go-reset>
    `
  }

}

window.customElements.define('go-polymer-app', GoPolymerApp);
