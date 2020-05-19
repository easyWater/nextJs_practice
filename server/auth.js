
const axios = require('axios')

const config = require('../config')

const { client_id, client_secret, get_token_url } = config.github


module.exports = (server) => {
  // 登录
  server.use(async (ctx, next) => {
    if(ctx.path === '/auth') {
      const code = ctx.query.code
      if(!code) {
        ctx.body = 'code is required'
        return
      }
      const result = await axios({ //获取token
        method: 'post',
        url: get_token_url,
        data: {
          client_id,
          client_secret,
          code
        },
        headers: {
          Accept: 'application/json'
        }
      })
      if(result.status === 200 && (result.data && !result.data.error)) {
        ctx.session.githubAuth = result.data
        const {access_token, token_type} = result.data
        const userInfoRes = await axios({
          method: 'get',
          url: 'https://api.github.com/user',
          headers: {
            Authorization: `${token_type} ${access_token}`
          }
        })
        ctx.session.userInfo = userInfoRes.data
        
        ctx.redirect((ctx.session && ctx.session.authBeforeUrl) || '/')
        ctx.session.authBeforeUrl = ''
      }else {
        const errMsg = result.data && result.data.error
        ctx.body = `request token failed ${errMsg}`
      }
    }else {
      await next()
    }
  })

  // 登出
  server.use(async (ctx, next) => {
    const method = ctx.method
    const path = ctx.path
    if(path === '/logout' && method === 'POST') {
      ctx.session = null
      ctx.body = 'logout success'
    }else {
      await next()
    }
  })

  // 记录登录前的url
  server.use(async (ctx, next) => {
    const method = ctx.method
    const path = ctx.path
    if(path === '/prepare-auth' && method === 'GET') {
      ctx.session.authBeforeUrl = ctx.query.url
      // ctx.body = 'ready'
      ctx.redirect(config.OAUTH_URL)
    }else {
      await next()
    }
  })

}