
const RED_TEAM = 'RED_TEAM'
const BLUE_TEAM = 'BLUE_TEAM'

let cell = {
 column: 0,
 row: 0,
 fill: null,
 highlighted: false
}

// Helper from https://medium.com/front-end-hacking/matrix-rotation-%EF%B8%8F-6550397f16ab
const flipMatrix = matrix => (
  matrix[0].map((column, index) => (
    matrix.map(row => row[index])
  ))
);

// Helper from https://medium.com/front-end-hacking/matrix-rotation-%EF%B8%8F-6550397f16ab
const rotateMatrixCounterClockwise = matrix => (
  flipMatrix(matrix).reverse()
);

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
  return rotateMatrixCounterClockwise(grid)
}

// From https://stackoverflow.com/questions/22236852/rotate-a-matrix-45-degrees-in-javascript
function scun(origMatrix) {
  var maxSize = origMatrix.length;//Presuming all internal are equal!
  var rotatedMatrix = [];
  var internalArray;
  var keyX,keyY,keyArray;
  for(var y=0;y<((maxSize * 2)-1);y++){
      internalArray = [];
      for(var x=0;x<maxSize;x++){
          keyX = x;
          keyY = y - x;
          if(keyY > -1){
              keyArray = origMatrix[keyY];
              if(typeof(keyArray) != 'undefined' && typeof(keyArray[keyX]) != 'undefined'){
                  internalArray.push(keyArray[keyX]);
              }
          }
      }
      rotatedMatrix.push(internalArray);
  }
  return rotatedMatrix
}

function rtlDiamond(grid) {
  return scun(grid.reverse())
}

function ltrDiamond(grid) {
  return scun(grid)
}

function findWinner(cells) {
  const blueWinningSeries = `BLUE_TEAM,BLUE_TEAM,BLUE_TEAM,BLUE_TEAM`
  const redWinningSeries = `RED_TEAM,RED_TEAM,RED_TEAM,RED_TEAM`
  let gridCells = cellsToGrid(cells)
  let ltrDiamondCells = ltrDiamond(gridCells)
  let rtlDiamondCells = rtlDiamond(gridCells)
  let sidewaysGridCells = gridToSideways(gridCells)
  if (
    gridCells.find(row => row.join(',').indexOf(blueWinningSeries) !== -1) ||
    sidewaysGridCells.find(row => row.join(',').indexOf(blueWinningSeries) !== -1) ||
    rtlDiamondCells.find(row => row.join(',').indexOf(blueWinningSeries) !== -1) ||
    ltrDiamondCells.find(row => row.join(',').indexOf(blueWinningSeries) !== -1)
  ) {
    return BLUE_TEAM
  } else if (
    gridCells.find(row => row.join(',').indexOf(redWinningSeries) !== -1) ||
    sidewaysGridCells.find(row => row.join(',').indexOf(redWinningSeries) !== -1) ||
    rtlDiamondCells.find(row => row.join(',').indexOf(redWinningSeries) !== -1) ||
    ltrDiamondCells.find(row => row.join(',').indexOf(redWinningSeries) !== -1)
  ) {
    return RED_TEAM
  } else {
    return null
  }
}

const reducer = (state, action) => {
  let newState = Object.assign({}, state)
  switch (action.type) {
    case 'start' :
      newState = { cells: [], turn: BLUE_TEAM, winner: null }
      for (let column = 0; column < action.size; column++) {
        for (let row = 0; row < action.size; row++) {
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
    default:
      return state
  }
}

export { reducer, cellsToGrid, BLUE_TEAM, RED_TEAM }
