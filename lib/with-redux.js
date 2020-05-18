import returnStore from '../store/store'

const isServer = typeof window === 'undefined'
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'

function getOrCreateStore(initialState) {
  if(isServer) { //服务端每次创建新的store
    return returnStore(initialState)
  }

  if(!window[__NEXT_REDUX_STORE__]) { //客户端保持一个store
    window[__NEXT_REDUX_STORE__] = returnStore(initialState)
  }
  return window[__NEXT_REDUX_STORE__]
}


export default (Comp) => {
  function withReduxApp({Component, pageProps, initialReduxState, ...rest}) {

    const reduxStore = getOrCreateStore(initialReduxState)

    return <Comp Component={Component} pageProps={pageProps} reduxStore={reduxStore} {...rest}/>
  }

  withReduxApp.getInitialProps = async (ctx) => {
    let reduxStore
    if(isServer) { //服务端渲染
      const { req } = ctx.ctx
      const session = req.session
      
      if(session && session.userInfo) { //存在用户数据
        reduxStore = getOrCreateStore({
          user: session.userInfo
        })
      }else {
        reduxStore = getOrCreateStore()
      }

    }else {
      reduxStore = getOrCreateStore()
    }
    
    ctx.reduxStore = reduxStore //将store传递给_app继而传递给各个页面，使得各个页面在服务端可以在getInitialProps中修改store

    let appProps = {}
    if(typeof Comp.getInitialProps === 'function') {
      appProps = await Comp.getInitialProps(ctx)
    }
    
    return {
      ...appProps,
      initialReduxState: reduxStore.getState() //序列化store中的数据
    }
  }

  return withReduxApp
}