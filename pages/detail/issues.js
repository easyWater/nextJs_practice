import withRepoBasic from '../../components/with-repo-basic'


const Issues = ({ test }) => {
  return <span>Issues page {test}</span>
}

Issues.getInitialProps = async () => {

  return {
    test: '123'
  }
}

export default withRepoBasic(Issues, 'issues')