import App, {Container} from 'next/app'
import 'antd/dist/antd.css'
import Layout from '../components/layout'
import MyContext from '../lib/myContext'

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
          <MyContext.Provider value={this.state.context}>
            <Component {...pageProps} />
            <button onClick={() => this.setState({ context: this.state.context + '000' })}>change context</button>
          </MyContext.Provider>
        </Layout>
      </Container>
    )
  }
}
export default myApp