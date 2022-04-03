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
    case 'ADD_OBJECT': 
      return {
        ...state, 
        objects: [...state.objects, {
          // id of object
          id: action.object.id,
          // velocity
          v: action.object.v,
          // angle
          a: action.object.a,
          // x position
          x: action.object.x,
          // y positino
          y: action.object.y,
          // length
          l: action.object.l,
          // width
          w: action.object.w,
        }]
      }
    case 'TICK':
      const projectedObjects = state.objects.map(object => {
        return {
          ...object,
          x: projectX(object),
          y: projectY(object)
        }
      })
      return {
        ...state,
        objects: adjustForCollisions(state.objects, projectedObjects)
      }
    default:
      return state
  }
}

export { reducer, BLUE_TEAM, RED_TEAM }
