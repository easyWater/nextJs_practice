import { useEffect } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { asyncAdd, addCount } from '../store/store'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

const Index = ({ count, name, reName, add}) => {
  useEffect(() => {
    axios.get('/api/user/info').then(res => console.log(res))
  }, [])
  return (
    <div>
      <span>
        count: {count}, name: {name}
      </span><br />
      <input value={name} onChange={(e) => reName(e.target.value)} />
      <button onClick={() => add(count)}>add count</button>
      <a href={publicRuntimeConfig.GITHUB_OAUTH_URL}>去登陆</a>
    </div>
  )
}

Index.getInitialProps = async (ctx) => {
  await ctx.reduxStore.dispatch(asyncAdd(3))
  return {}
}

function mapStateToProps(state) {
  return {
    count: state.count.count,
    name: state.user.name
  }
}

function mapDispatchToProps(dispatch) {
  return {
    add: (num) => dispatch({ type: 'ADD', num }),
    reName: (name) => dispatch({ type: 'UPDATE_NAME', name })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)