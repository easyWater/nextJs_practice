const Koa = require('koa')
const next = require('next')
const Router = require('koa-router')
const session = require('koa-session')
const Redis = require('ioredis')
const koaBody = require('koa-body')

const RedisSessionStore = require('./server/session-store')
const auth = require('./server/auth')
const api = require('./server/api')

const dev = process.env.NODE_ENV !== 'production' //判断当前不是生产环境
const app = next({ dev })
const handle = app.getRequestHandler()

// 创建redis client
const redis = new Redis()

app.prepare().then(() => { //在next将pages下面的组件转化之后再启动koa服务处理其他请求
  const server = new Koa()
  const router = new Router()

  server.use(koaBody())

  server.keys = ['easy_water develop github app']
  const SESSION_CONFIG = {
    key: 'yid',
    store: new RedisSessionStore(redis)
  }

  server.use(session(SESSION_CONFIG, server))
  auth(server)
  api(server)


  server.use(async (ctx, next) => {
    // console.log('session is: ', ctx.session)
    await next()
  })

  router.get('/a/:id', async (ctx) => {
    const id = ctx.params.id
    await handle(ctx.req, ctx.res, {
      pathname: '/a',
      query: {id}
    })
    ctx.respond = false
  })

  router.get('/api/user/info', async (ctx) => {
    const userInfo = ctx.session.userInfo
    if(userInfo) {
      ctx.body = userInfo
      ctx.set('Content-Type', 'application/json')
    }else {
      ctx.body = 'need login'
      ctx.status = 401
    }
  })

  server.use(router.routes())

  server.use(async (ctx, next) => { //将next集成到koa服务中
    ctx.req.session = ctx.session
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.listen(3000, () => { //开启koa服务
    console.log('koa server listening on 3000')
  })
})