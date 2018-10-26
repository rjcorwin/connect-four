import { findValidDrops, findWinner, RED_TEAM, BLUE_TEAM } from './helpers'

let cell = {
 column: 0,
 row: 0,
 fill: null,
 highlighted: false
}

const reducer = (state, action) => {
  let newState = Object.assign({}, state)
  switch (action.type) {
    case 'START' :
      newState = { cells: [], turn: BLUE_TEAM, winner: null }
      for (let column = 0; column < action.size; column++) {
        for (let row = 0; row < action.size; row++) {
          newState.cells.push(Object.assign({}, cell, {column, row}))
        }
      }
      return Object.assign({}, newState, {
        validDrops: findValidDrops(newState.cells)
      })
      break;
    case 'DROP' :
      const emptyCell = state.cells.find(cell => !cell.fill && cell.column == action.columnNumber)
      const rowNumber = !emptyCell ? null : emptyCell.row
      newState = Object.assign({}, state, {
        turn: state.turn === BLUE_TEAM ? RED_TEAM : BLUE_TEAM,
        cells: state.cells
          .map(cell => Object.assign({}, cell, { fill: (cell.row === rowNumber && cell.column === action.columnNumber) ? state.turn : cell.fill }))
      })
      return Object.assign({}, newState, {
        winner: findWinner(newState.cells),
        validDrops: findValidDrops(newState.cells) 
      })
      break;
    default:
      return state
  }
}

export { reducer, BLUE_TEAM, RED_TEAM }
