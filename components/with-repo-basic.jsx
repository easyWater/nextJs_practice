import { withRouter } from 'next/router'
import Link from 'next/link'
import { useEffect } from 'react'

import Repo from './repo'
import { request } from '../lib/api'
import { get, set } from '../lib/repo-basic-cache'

const isServer = typeof window === 'undefined'

function makeQuery(queryObj) {
  const query = Object.entries(queryObj).reduce((result, item) => {
    result.push(item.join('='))
    return result
  }, []).join('&')

  return `?${query}`
}

export default (Comp, type) => {

  function withDetail({ repoBasic, router, ...rest }) {

    const queryStr = makeQuery(router.query)
    useEffect(() => {
      if(!isServer) set(repoBasic)
    })
  
    return (
      <div className="root">
        <div className="repo-basic">
          <Repo repo={repoBasic} />
          <div className="tabs">

            { type === 'index' ? <span className="tab">Readme</span> : (
              <Link href={`/detail${queryStr}`}>
                <a className="tab readme">Readme</a>
              </Link>
            ) }

            { type === 'issues' ? <span className="tab">Issues</span> : (
              <Link href={`/detail/issues${queryStr}`}>
                <a className="tab issues">Issues</a>
              </Link>
            ) }
            
          </div>
        </div>
        <div>
          <Comp { ...rest } />
        </div>
        <style jsx>{`
          .root {
            padding-top: 20px;
          }
          .repo-basic {
            padding: 20px;
            border: 1px solid #eee;
            margin-bottom: 20px;
            border-radius: 5px;
          }
          .tab + .tab {
            margin-left: 20px;
          }
          `}</style>
      </div>
    )
  }

  withDetail.getInitialProps = async (context) => {
    const { ctx } = context
    const { owner, name } = ctx.query
    const full_name = `${owner}/${name}`

    let pageData = {}
    if(Comp.getInitialProps) {
      pageData = await Comp.getInitialProps(context)
    }

    if(get(full_name)) {
      return {
        repoBasic: get(full_name),
        ...pageData
      }
    }

    const result = await request({
      url: `repos/${owner}/${name}`
    }, ctx.req, ctx.res)
  
    return {
      repoBasic: result.data,
      ...pageData
    }
  }

  return withRouter(withDetail)
}