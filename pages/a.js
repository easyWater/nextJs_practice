import Comp from '../components/comp'
import { withRouter } from 'next/router'

const A = ({ router, name }) => <Comp>A {router.query.id} {name}</Comp>

A.getInitialProps = async () => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        name: 'easy_water'
      })
    }, 1000)
  })
  return await promise
}

//通过 withRouter 高阶组件向A组件中注入路由相关信息
export default withRouter(A)