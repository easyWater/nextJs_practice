import { request } from '../lib/api'

const Index = ({ userRepos }) => {
  console.log(userRepos)
  return (
    <span>Index</span>
  )
}

Index.getInitialProps = async ({ ctx }) => {

  const result = await request({
    url: '/user/repos'
  }, ctx.req, ctx.res)

  return {
    userRepos: result.data
  }
}

export default Index