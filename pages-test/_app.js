import App, {Container} from 'next/app'
import 'antd/dist/antd.css'
import Layout from '../components/layout'
import MyContext from '../lib/myContext'

import { Provider } from 'react-redux'

import withRedux from '../lib/with-redux'

class myApp extends App {

  state = {
    context: 'context'
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
      <Container>
        <Layout>
          <Provider store={reduxStore}>
            <MyContext.Provider value={this.state.context}>
              <Component {...pageProps} />
            </MyContext.Provider>
          </Provider>
        </Layout>
      </Container>
    )
  }
}
export default withRedux(myApp)