
const RED_TEAM = 'RED_TEAM'
const BLUE_TEAM = 'BLUE_TEAM'

let cell = {
 column: 0,
 row: 0,
 fill: null,
 highlighted: false
}

function cellsToGrid(cells) {
  const numberOfRows = cells.reduce((numberOfRows, cell) => cell.row > numberOfRows ? cell.row : numberOfRows , 0) + 1
  const numberOfColumns = cells.reduce((numberOfColumns, cell) => cell.column > numberOfColumns ? cell.column : numberOfColumns , 0) + 1
  // Build the grid.
  var gridMap = []
  for (let row = 0; row < numberOfRows; row++) {
    if (!gridMap[row]) gridMap[row] = []
    for (let column = 0; column < numberOfColumns; column++) {
      gridMap[row][column] = cells.find(cell => cell.column === column && cell.row === row).fill
    }
  }
  return gridMap
}

function gridToSideways(grid) {
  // @TODO
  return grid
}

function gridToDiamond(grid) {
  // @TODO
  return grid
  const numberOfRows = cells.reduce((numberOfRows, cell) => cell.row > numberOfRows ? cell.row : numberOfRows , 0) + 1
  const numberOfColumns = cells.reduce((numberOfColumns, cell) => cell.column > numberOfColumns ? cell.column : numberOfColumns , 0) + 1
  // Number of diagonal lines in a grid.
  const diagonalLines = numberOfColumns + numberOfRows - 1
  for (let row = 0; row < diagonalLines; row++) {
  }
}

function findWinner(cells) {
  const blueWinningSeries = `BLUE_TEAM,BLUE_TEAM,BLUE_TEAM,BLUE_TEAM`
  const redWinningSeries = `RED_TEAM,RED_TEAM,RED_TEAM,RED_TEAM`
  let gridCells = cellsToGrid(cells)
  let sidewaysGridCells = gridToSideways(gridCells)
  let diamondGridCells = gridToDiamond(gridCells)
  if (
    gridCells.find(row => row.join(',').indexOf(blueWinningSeries) !== -1) ||
    sidewaysGridCells.find(row => row.join(',').indexOf(blueWinningSeries) !== -1) ||
    diamondGridCells.find(row => row.join(',').indexOf(blueWinningSeries) !== -1)
  ) {
    return BLUE_TEAM
  } else if (
    gridCells.find(row => row.join(',').indexOf(redWinningSeries) !== -1) ||
    sidewaysGridCells.find(row => row.join(',').indexOf(redWinningSeries) !== -1) ||
    diamondGridCells.find(row => row.join(',').indexOf(redWinningSeries) !== -1)
  ) {
    return RED_TEAM
  } else {
    return null
  }
}

const reducer = (state = { cells: [], turn: BLUE_TEAM, winner: null }, action) => {
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
      newState = Object.assign({}, state, {
        turn: state.turn === BLUE_TEAM ? RED_TEAM : BLUE_TEAM,
        cells: state.cells
          .map(cell => Object.assign({}, cell, { fill: (cell.row === rowNumber && cell.column === action.columnNumber) ? state.turn : cell.fill }))
      })
      newState.winner = findWinner(newState.cells)
      return newState
      break;
  }
}

export { reducer, BLUE_TEAM, RED_TEAM }
