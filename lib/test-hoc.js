export default (Comp) => {
  function TestHoc({Component, pageProps, ...rest}) {

    console.log('Component: ', Component, 'pageProps: ', pageProps)

    if(pageProps) {
      pageProps.test = '123'
    }

    return <Comp Component={Component} pageProps={pageProps} {...rest}/>
  }

  TestHoc.getInitialProps = Comp.getInitialProps

  return TestHoc
}