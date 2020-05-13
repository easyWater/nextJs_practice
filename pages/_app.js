import App, {Container} from 'next/app'
import 'antd/dist/antd.css'
import Layout from '../components/layout'
import MyContext from '../lib/myContext'

import store from '../store/store'
import { Provider } from 'react-redux'

import TestHoc from '../lib/test-hoc'

class myApp extends App {

  state = {
    context: 'context'
  }

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}
    if(Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    return {
      pageProps
    }
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <Container>
        <Layout>
          <Provider store={store}>
            <MyContext.Provider value={this.state.context}>
              <Component {...pageProps} />
            </MyContext.Provider>
          </Provider>
        </Layout>
      </Container>
    )
  }
}
export default TestHoc(myApp)