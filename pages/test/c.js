import React, {useState, useReducer, useEffect, useLayoutEffect, useContext, useRef, memo, useMemo, useCallback} from 'react'

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

  const [count, dispathCount] = useReducer(countReducer, 0)
  const [name, setName] = useState('yyy')

  const countRef = useRef()
  countRef.current = count

  const config = useMemo(() => ({
    count,
    color: count > 3 ? 'red' : 'blur'
  }), [count])

  // const handleClick = useCallback(() => dispathCount({ type: 'add' }), [])
  const handleClick = useMemo(() => (() => dispathCount({ type: 'add' })), [])
  const handleAlertClick = () => {
    setTimeout(() => {
      alert(countRef.current)
    }, 2000)
  }

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)}/>
      <Children config={config} handleClick={handleClick} />
      <button onClick={handleAlertClick}>alert count</button>
    </div>
  )
}

const Children = memo(function Children({config, handleClick}) {
  console.log('Children render')
  return (
    <button style={{color: config.color}} onClick={handleClick}>count is {config.count}</button>
  )
})

export default myCount