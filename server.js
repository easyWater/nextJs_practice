const Koa = require('koa')
const next = require('next')
const Router = require('koa-router')

const dev = process.env.NODE_ENV !== 'production' //判断当前不是生产环境
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => { //在next将pages下面的组件转化之后再启动koa服务处理其他请求
  const server = new Koa()
  const router = new Router()

  router.get('/a/:id', async (ctx) => {
    const id = ctx.params.id
    await handle(ctx.req, ctx.res, {
      pathname: '/a',
      query: {id}
    })
    ctx.respond = false
  })

  server.use(router.routes())

  server.use(async (ctx, next) => { //将next集成到koa服务中
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.listen(3000, () => { //开启koa服务
    console.log('koa server listening on 3000')
  })
})