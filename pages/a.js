import Comp from '../components/comp'
import { withRouter } from 'next/router'

const A = ({ router }) => <Comp>A {router.query.id}</Comp>

//通过 withRouter 高阶组件向A组件中注入路由相关信息
export default withRouter(A)