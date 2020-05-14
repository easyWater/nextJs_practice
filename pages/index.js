import { connect } from 'react-redux'
import { asyncAdd, addCount } from '../store/store'

const Index = ({ count, name, reName, add}) => {
  return (
    <div>
      <span>
        count: {count}, name: {name}
      </span><br />
      <input value={name} onChange={(e) => reName(e.target.value)} />
      <button onClick={() => add(count)}>add count</button>
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