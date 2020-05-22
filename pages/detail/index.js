import withRepoBasic from '../../components/with-repo-basic'


const Detail = ({ test }) => {
  return <span>Detail page {test}</span>
}

Detail.getInitialProps = async () => {

  return {
    test: '123'
  }
}

export default withRepoBasic(Detail, 'index')