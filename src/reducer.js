
const RED_TEAM = 'RED_TEAM'
const BLUE_TEAM = 'BLUE_TEAM'

let initialState = {
  cells: [],
  turn: BLUE_TEAM
}

let cell = {
 column: 0,
 row: 0,
 fill: false
}


const reducer = (state = { cells: [], turn: BLUE_TEAM }, action) => {
  let newState = Object.assign({}, state)
  switch (action.type) {
    case 'start' :
      for (let column = 0; column < action.columns; column++) {
        for (let row = 0; row < action.rows; row++) {
          newState.cells.push(Object.assign({}, cell, {column, row}))
        }
      }
      return newState
      break;
    case 'drop' :
      const emptyCell = state.cells.find(cell => !cell.fill && cell.column == action.columnNumber)
      const rowNumber = !emptyCell ? null : emptyCell.row
      return Object.assign({}, state, {
        turn: state.turn === BLUE_TEAM ? RED_TEAM : BLUE_TEAM,
        cells: state.cells
          .map(cell => Object.assign({}, cell, { fill: (cell.row === rowNumber && cell.column === action.columnNumber) ? state.turn : cell.fill }))
      })
      break;
  }

}

export { reducer, BLUE_TEAM, RED_TEAM }
