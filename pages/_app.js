import App from 'next/app'
import 'antd/dist/antd.css'
import Layout from '../components/layout'

import { Provider } from 'react-redux'

import withRedux from '../lib/with-redux'

class myApp extends App {

  static async getInitialProps(ctx) {
    const { Component } = ctx
    let pageProps = {}
    if(Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    return {
      pageProps
    }
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props
    return (
      <Layout>
        <Provider store={reduxStore}>
          <Component {...pageProps} />
        </Provider>
      </Layout>
    )
  }
}
export default withRedux(myApp)