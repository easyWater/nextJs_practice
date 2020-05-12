const withCss = require('@zeit/next-css') //在nextJs中引用css文件需要的插件

const configs = {
  distDir: 'dest', //编译文件的输出目录
  generateEtags: true, //是否给每个路由生成etag,如果etag未改变则不返回页面而是使用之前的缓存
  onDemandEntries: {
    maxInactiveAge: 25 * 1000, //内容在内存中缓存的时长 ms
    pagesBufferLength: 2, //同时可缓存多少个页面
  },
  pageExtensions: ['js', 'jsx'], //在pages目录下哪种后缀的文件会被认为是页面
  generateBuildId: async () => {
    if(process.env.YOUR_BUILD_ID) {
      return process.env.YOUR_BUILD_ID
    }

    //返回null，使用默认的unique id
    return null
  },
  webpack(config, options) { //手动修改nextJs 中的webpack配置
    return config
  },
  webpackDevMiddleware: config => { //修改webpackDevMiddleware配置
    return config
  },
  env: { //可以在页面上通过 process.env.customKey 获取value
    customKey: 'value', 
  },
  //下面两个要通过 next/config 来读取
  serverRuntimeConfig: { //只有在服务端渲染才能获取的配置
    mySeceret: 'secret',
    secondSecret: process.env.SECOND_SECRET,
  },
  publicRuntimeConfig: { //在服务端渲染和客户端渲染都可以获取的配置
    staticFolder: '/static',
  }


}

if(typeof require !== 'undefined') {
  require.extensions['.css'] = file => {}
}

module.exports = withCss({})