const withCss = require('@zeit/next-css') //在nextJs中引用css文件需要的插件

if(typeof require !== 'undefined') {
  require.extensions['.css'] = file => {}
}

module.exports = withCss({})