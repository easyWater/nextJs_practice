const Koa = require('koa')
const next = require('next')
const Router = require('koa-router')
const session = require('koa-session')

const dev = process.env.NODE_ENV !== 'production' //判断当前不是生产环境
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => { //在next将pages下面的组件转化之后再启动koa服务处理其他请求
  const server = new Koa()
  const router = new Router()

  server.keys = ['easy_water develop github app']
  const SESSION_CONFIG = {
    key: 'yid',
    // store: {}
  }

  server.use(session(SESSION_CONFIG, server))


  server.use(async (ctx, next) => {
    console.log('session is: ', ctx.session)
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

  router.get('/session/user', async (ctx) => {
    // ctx.respond = false
    ctx.session.user = {
      name: 'yyy',
      age: 18
    }
    ctx.body = `session set success`
  })

  server.use(router.routes())

  server.use(async (ctx, next) => { //将next集成到koa服务中
    ctx.cookies.set('id', 'userId:xxxxx')
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.listen(3000, () => { //开启koa服务
    console.log('koa server listening on 3000')
  })
})