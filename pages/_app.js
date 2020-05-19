import App from 'next/app'
import 'antd/dist/antd.css'
import Layout from '../components/layout'
import PageLoading from '../components/pageLoading'

import { Provider } from 'react-redux'
import Router from 'next/router'
import Link from 'next/link'
import withRedux from '../lib/with-redux'

class myApp extends App {

  state = {
    loading: false
  }

  showLoading = () => {
    this.setState({ loading: true })
  }

  hiddenLoading = () => {
    this.setState({ loading: false })
  }

  componentDidMount() {
    Router.events.on('routeChangeStart', this.showLoading)
    Router.events.on('routeChangeComplete', this.hiddenLoading)
    Router.events.on('routeChangeError', this.hiddenLoading)
  }

  componentWillUnmount() {
    Router.events.off('routeChangeStart', this.showLoading)
    Router.events.off('routeChangeComplete', this.hiddenLoading)
    Router.events.off('routeChangeError', this.hiddenLoading)
  }

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
      <Provider store={reduxStore}>
        { this.state.loading ? <PageLoading /> : null }
        <Layout>
          <Link href="/">
            <a>Index</a>
          </Link>&nbsp;
          <Link href="/detail">
            <a>Detail</a>
          </Link><br />
          <Component {...pageProps} />
        </Layout>
      </Provider>
    )
  }
}
export default withRedux(myApp)