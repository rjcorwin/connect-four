
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



const reducer = (action, state) => {
    let newState = Object.assign({}, initialState)
  switch (action.type) {
  case 'start' :
  for (let column = 0; column < action.columns; column++) {
  for (let row = 0; row < action.rows; row++) {
    newState.cells.push(Object.assign({}, cell, {column, row}))
  }
  }
  return Object.assign({}, state, newState)
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

const ready = () => {

  let state = Object.assign({}, initialState)

  state = reducer({type: 'start', columns: 3, rows: 3}, state)
  if (state.cells.length !== 9) throw(new Error('Starting a game with 3 columns 3 rows should have 9 cells.'))

  state = reducer({type: 'drop', columnNumber: 2}, state)
  if (!state.cells.find(cell => cell.fill === BLUE_TEAM && cell.column === 2 && cell.row === 0)) throw(new Error('Blue team should place first in correct column and row.'))

  try {
  state = reducer({type: 'drop', columnNumber: 2}, state)
  if (!state.cells.find(cell => cell.fill === RED_TEAM && cell.column === 2 && cell.row === 1)) throw(new Error('Red team should fill on top of blue team'))
  } catch (error) {
  debugger
  }

}
