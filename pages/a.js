import Link from 'next/link'
import { withRouter } from 'next/router'
import styled from 'styled-components'
// import moment from 'moment'
import dynamic from 'next/dynamic'
const Comp = dynamic(import('../components/comp'))

const Title = styled.h1`
  font-size: 20px;
  color: pink;
`

const A = ({ router, name, time }) => {
  return (
    <>
      <Link href="#aaa">
        <a>
          A {router.query.id} {name}
          <Title>this is title {time}</Title>
          <Comp />
        </a>
      </Link>
    </>
  )
}

A.getInitialProps = async () => {
  const moment = await import('moment')
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        name: 'easy_water',
        time: moment.default(Date.now() - 60 * 1000).fromNow()
      })
    }, 1000)
  })
  return await promise
}

//通过 withRouter 高阶组件向A组件中注入路由相关信息
export default withRouter(A)