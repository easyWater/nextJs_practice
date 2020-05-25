import dynamic from 'next/dynamic'

import withRepoBasic from '../../components/with-repo-basic'
import { request } from '../../lib/api'
const MarkdownRenderer = dynamic(() => import('../../components/markdownRenderer'), {
  loading: () => <p>Loading...</p>
})

const Detail = ({ readMe }) => {
  return <MarkdownRenderer content={readMe.content} isBase64={true} />
}

Detail.getInitialProps = async ({ ctx: { query:  { owner, name }, res, req } }) => {
 
  const readMeRes = await request({
    url: `repos/${owner}/${name}/readme`
  }, res, req)

  return {
    readMe: readMeRes.data
  }
}

export default withRepoBasic(Detail, 'index')