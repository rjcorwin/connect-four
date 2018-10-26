
const RED_TEAM = 'RED_TEAM'
const BLUE_TEAM = 'BLUE_TEAM'

function findValidDrops(cells) {
  const topRow = cells.reduce((acc, cell) => acc >= cell.row ? acc : cell.row, 0)
  return cells.reduce((acc, cell) => cell.row === topRow && !cell.fill ? [...acc, cell.column] : acc, [])
}

function findWinner(cells) {
  const blueWinningSeries = `BLUE_TEAM,BLUE_TEAM,BLUE_TEAM,BLUE_TEAM`
  const redWinningSeries = `RED_TEAM,RED_TEAM,RED_TEAM,RED_TEAM`
  let matrix = cellsToMatrix(cells)
  let ltrDiamondCells = ltrDiamond(matrix)
  let rtlDiamondCells = rtlDiamond(matrix)
  let sidewaysGridCells = rotateMatrixCounterClockwise(matrix)
  if (
    matrix.find(row => row.join(',').indexOf(blueWinningSeries) !== -1) ||
    sidewaysGridCells.find(row => row.join(',').indexOf(blueWinningSeries) !== -1) ||
    rtlDiamondCells.find(row => row.join(',').indexOf(blueWinningSeries) !== -1) ||
    ltrDiamondCells.find(row => row.join(',').indexOf(blueWinningSeries) !== -1)
  ) {
    return BLUE_TEAM
  } else if (
    matrix.find(row => row.join(',').indexOf(redWinningSeries) !== -1) ||
    sidewaysGridCells.find(row => row.join(',').indexOf(redWinningSeries) !== -1) ||
    rtlDiamondCells.find(row => row.join(',').indexOf(redWinningSeries) !== -1) ||
    ltrDiamondCells.find(row => row.join(',').indexOf(redWinningSeries) !== -1)
  ) {
    return RED_TEAM
  } else {
    return null
  }
}

function cellsToMatrix(cells) {
  const numberOfRows = cells.reduce((numberOfRows, cell) => cell.row > numberOfRows ? cell.row : numberOfRows , 0) + 1
  const numberOfColumns = cells.reduce((numberOfColumns, cell) => cell.column > numberOfColumns ? cell.column : numberOfColumns , 0) + 1
  // Build the matrix.
  var matrix = []
  for (let row = 0; row < numberOfRows; row++) {
    if (!matrix[row]) matrix[row] = []
    for (let column = 0; column < numberOfColumns; column++) {
      matrix[row][column] = cells.find(cell => cell.column === column && cell.row === row).fill
    }
  }
  return matrix
}

// From https://stackoverflow.com/a/12646864
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array
}

// From https://medium.com/front-end-hacking/matrix-rotation-%EF%B8%8F-6550397f16ab
const flipMatrix = matrix => (
  matrix[0].map((column, index) => (
    matrix.map(row => row[index])
  ))
);

// From https://medium.com/front-end-hacking/matrix-rotation-%EF%B8%8F-6550397f16ab
const rotateMatrixCounterClockwise = matrix => (
  flipMatrix(matrix).reverse()
);

// From https://stackoverflow.com/questions/22236852/rotate-a-matrix-45-degrees-in-javascript
function matrixToDiamond(origMatrix) {
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

function rtlDiamond(matrix) {
  return matrixToDiamond(matrix.reverse())
}

function ltrDiamond(matrix) {
  return matrixToDiamond(matrix)
}


export { shuffleArray, cellsToMatrix, findWinner, findValidDrops, BLUE_TEAM, RED_TEAM }
