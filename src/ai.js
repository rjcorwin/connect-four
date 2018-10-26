
import { reducer, cellsToGrid } from './reducer'

const RED_TEAM = 'RED_TEAM'
const BLUE_TEAM = 'BLUE_TEAM'

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

function ai(state) {
  // Find a win for me.
  let winningMoves = findWinningMoves(state)
  if (winningMoves.length > 0) {
    return shuffleArray(winningMoves)[0]
  } else {
    // Generate a series of potential moves in random order.
    let potentialMoves = []
    let matrix = cellsToGrid(state.cells)
    for(let i = 0; i < matrix[0].length; i++) {
      // TODO: Protect against columns that are full.
      potentialMoves.push(i)
    }
    // Find moves that do not result in the opponent having a winning move.
    let safeMoves = []
    for(let potentialMove of potentialMoves) {
      let futureStore = Redux.createStore(reducer, state)
      futureStore.dispatch({type: 'drop', columnNumber: potentialMove})
      if (findWinningMoves(futureStore.getState()).length === 0) {
        safeMoves.push(potentialMove)
      }
    }
    // If no save moves, force our hand by taking the first potential move.
    if (safeMoves.length > 0) {
      // Return one of the safe moves.
      return shuffleArray(safeMoves)[0]
    } else {
      return shuffleArray(potentialMoves)[0]
    }
  }

}

function findWinningMoves(state) {
  let matrix = cellsToGrid(state.cells)
  const winningMoves = []
  for (let i = 0; matrix[0].length > i; i++) {
    let store = Redux.createStore(reducer, state)
    store.dispatch({type: 'drop', columnNumber: i})
    if (store.getState().winner) winningMoves.push(i)
  }
  return winningMoves
}

export { ai }
