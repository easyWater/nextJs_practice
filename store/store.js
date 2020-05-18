import { createStore, combineReducers, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import axios from 'axios'

const userInitialState = {}

const LOGOUT = 'LOGOUT'

// action create
export function logout() {
  return (dispatch) => {
    axios.post('/logout').then(res => {
      if(res.status === 200) {
        dispatch({
          type: LOGOUT
        })
      }else {
        console.log('logout failed', res)
      }
    }).catch(err => {
      console.log('logout failed', err)
    })
  }
}

function userReducer(state = userInitialState, action) {
  switch(action.type) {
    case LOGOUT: 
      return {}
    default:
      return state
  }
}

const allReducers = combineReducers({
  user: userReducer
})

export default function returnStore(defaultState) {
  const store = createStore(
    allReducers, 
    Object.assign({}, 
      {
        user: userInitialState
      }, defaultState),
    composeWithDevTools(applyMiddleware(ReduxThunk))
  )
  return store
}
