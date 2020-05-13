import { createStore, combineReducers, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

const initialState = {
  count: 0
}

const userInitialState = {
  name: 'yyy'
}

const ADD = 'ADD'
const UPDATE_NAME = 'UPDATE_NAME'

function countReducer(state = initialState, action) {
  switch(action.type) {
    case ADD:
      return { count: state.count + (action.num || 1)}
    default:
      return state
  }
}

function userReducer(state = userInitialState, action) {
  switch(action.type) {
    case UPDATE_NAME:
      return {
        ...state,
        name: action.name
      }
    default:
      return state
  }
}

function asyncAdd(num) {
  return (dispatch) => {
    setTimeout(() => {
      dispatch({ type:  ADD, num})
    }, 1000)
  }
}

const allReducers = combineReducers({
  count: countReducer,
  user: userReducer
})

const store = createStore(
  allReducers, 
  {
    count: initialState,
    user: userInitialState
  },
  composeWithDevTools(applyMiddleware(ReduxThunk))
)
// console.log(store.getState())
store.subscribe(() => {
  console.log(store.getState())
})
store.dispatch(asyncAdd(5))
store.dispatch({ type: ADD })
// store.dispatch({ type: UPDATE_NAME, name: 'lilei' })

export default store
