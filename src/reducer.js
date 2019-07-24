
let defaultState = {
  xBound: 1000,
  yBound: 1000,
  vMin: 10,
  objects: []
}

const reducer = (state = defaultState, action) => {
  let newState = Object.assign({}, state)
  switch (action.type) {
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

function adjustForCollisions(currentObjects, projectedObjects) {
  // @TODO Look for collisions and react. 
  return projectedObjects 
}

function projectX(object) {
  switch (object.a) {
    case 0:
      return object.x
    case 90:
      return object.x + object.v
    case 180:
      return object.x
    case 270:
      return object.x - object.v
    default:
      return object.x
  }
} 

function projectY(object) {
  switch (object.a) {
    case 0:
      return object.y + object.v
    case 90:
      return object.y
    case 180:
      return object.y - object.v
    case 270:
      return object.y
    default:
      return object.y
  }
}

export { reducer }
