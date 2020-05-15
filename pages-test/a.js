import Link from 'next/link'
import { withRouter } from 'next/router'
import styled from 'styled-components'
// import moment from 'moment'
// import getConfig from 'next/config'
import dynamic from 'next/dynamic'
const Comp = dynamic(import('../components/comp'))

const Title = styled.h1`
  font-size: 20px;
  color: pink;
`

// const {serverRuntimeConfig, publicRuntimeConfig} = getConfig()

const A = ({ router, name, time }) => {
  // console.log(serverRuntimeConfig, publicRuntimeConfig)
  return (
    <>
      <Link href="#aaa">
        <a>
          A {router.query.id} {name} {process.env.customKey}
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