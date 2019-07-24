
let defaultState = {
  xBound: 1000,
  yBound: 1000,
  tailExpiration: 5,
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
    case 'TURN_OBJECT_UP':
      return {
        ...state,
        objects: state.objects.map(object => {
            return object.id === action.objectId 
              ? { ...object, a: 0 }
              : object
          })
      }
    case 'TURN_OBJECT_DOWN':
      return {
        ...state,
        objects: state.objects.map(object => {
            return object.id === action.objectId 
              ? { ...object, a: 180 }
              : object
          })
      }
    case 'TURN_OBJECT_LEFT':
      return {
        ...state,
        objects: state.objects.map(object => {
            return object.id === action.objectId 
              ? { ...object, a: 270 }
              : object
          })
      }
    case 'TURN_OBJECT_RIGHT':
      return {
        ...state,
        objects: state.objects.map(object => {
            return object.id === action.objectId 
              ? { ...object, a: 90 }
              : object
          })
      }
    case 'TICK':
      return {
        ...state,
        objects: buildTails(state.objects, adjustForCollisions(state.objects, projectObjects(state.objects)))
      }
    default:
      return state
  }
}


function buildTails(currentObjects, projectedObjects) {
  return projectedObjects
}

function adjustForCollisions(currentObjects, projectedObjects) {
  const objectsWithCollision = projectedObjects.reduce((objectsWithCollision, possibleCollisionObject) => {
    return projectedObjects.find(object => object.id !== possibleCollisionObject.id && object.x === possibleCollisionObject.x && object.y === possibleCollisionObject.y)
      ? [...objectsWithCollision, possibleCollisionObject]
      : objectsWithCollision
  }, [])
  return projectedObjects.map(projectedObject => {
    return objectsWithCollision.find(objectWithCollision => objectWithCollision.id === projectedObject.id)
      ? {
          ...currentObjects.find(currentObject => currentObject.id === projectedObject.id),
          a: undefined,
          collision: true
        }
      : projectedObject
  })
}

function projectObjects(currentObjects) {
  return currentObjects.map(projectObject)
}

function projectObject(object) {
  return {
    ...object,
    x: projectX(object),
    y: projectY(object)
  }
}

function projectX(object) {
  switch (object.a) {
    case undefined:
      return object.x
    case 0:
      return object.x
    case 90:
      return object.x + 1
    case 180:
      return object.x
    case 270:
      return object.x - 1
    default:
      return object.x
  }
} 

function projectY(object) {
  switch (object.a) {
    case undefined:
      return object.y
    case 0:
      return object.y + 1
    case 90:
      return object.y
    case 180:
      return object.y - 1
    case 270:
      return object.y
    default:
      return object.y
  }
}

export { reducer }
