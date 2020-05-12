import React, {useState, useReducer, useEffect, useLayoutEffect, useContext} from 'react'
import MyContext from '../../lib/myContext'

class B extends React.Component {

  state = {
    count: 0
  }

  componentDidMount() {
    this.timeId = setInterval(() => {
      this.setState({count: this.state.count + 1})
    }, 1000)
  }

  componentWillUnmount() {
    if(this.timeId) {
      clearInterval(this.timeId)
    }
  }

  render() {
    return (
      <span>{this.state.count}</span>
    )
  }
}

function countReducer(state, action) {
  switch(action.type) {
    case 'add':
      return state + 1
    case 'minus':
      return state - 1
    default:
      return state
  }
}

function myCount() {

  // const [count, setCount] = useState(0)
  const [count, dispathCount] = useReducer(countReducer, 0)
  const [name, setName] = useState('yyy')

  const context = useContext(MyContext)

  // useEffect(() => {
  //   const timeId = setInterval(() => {
  //     // setCount(c => c + 1)
  //     dispathCount({type: 'minus'})
  //   }, 1000)

  //   return () => clearInterval(timeId)
  // }, [])

  useEffect(() => {
    console.log('effect invoked')
    return () => console.log('effect deleted')
  }, [count])

  useLayoutEffect(() => {
    console.log('useLayoutEffect invoked')
    return () => console.log('useLayoutEffect deleted')
  }, [count])

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)}/>
      <button onClick={e => dispathCount({type: 'add'})}>{count}</button>
      {context}
    </div>
  )
}

export default myCount