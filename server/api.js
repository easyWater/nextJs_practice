
const api = require('../lib/api')


module.exports = (server) => {
  server.use(async (ctx, next) => { // /github开头的请求，代理到github
    const { path } = ctx
    if(path.startsWith('/github/')) {
      
      const session = ctx.session
      const githubAuth = session && session.githubAuth
      
      let headers = {}
      if(githubAuth && githubAuth.access_token) {
        headers['Authorization'] = `${githubAuth.token_type} ${githubAuth.access_token}`
      }

      const result = await api.requestGithub(ctx.method, `${ctx.url.replace('/github/', '/')}`, ctx.request.body || {}, headers)

      ctx.status = result.status
      ctx.body = result.body

    }else {
      await next()
    }
  })

  // server.use(async (ctx, next) => { // /github开头的请求，代理到github
  //   const { path } = ctx
  //   if(path.startsWith('/github/')) {
  //     const requestUrl = `${github_api}${ctx.url.replace('/github/', '/')}`
  //     const githubAuth = ctx.session.githubAuth
      
  //     let headers = {}
  //     if(githubAuth && githubAuth.access_token) {
  //       headers['Authorization'] = `${githubAuth.token_type} ${githubAuth.access_token}`
  //     }

  //     try{
  //       const result = await axios({
  //         method: 'GET',
  //         url: requestUrl,
  //         headers
  //       })
  
  //       if(result.status === 200) {
  //         ctx.body = result.data
  //         ctx.set('Content-Type', 'application/json')
  //       }else {
  //         ctx.status = result.status
  //         ctx.body = {
  //           success: false
  //         }
  //         ctx.set('Content-Type', 'application/json')
  //       }

  //     }catch(err) {
  //       console.error(err)
  //       ctx.body = {
  //         success: false
  //       }
  //       ctx.set('Content-Type', 'application/json')
  //     }

  //   }else {
  //     await next()
  //   }
  // })
}