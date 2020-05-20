import { Button, Tabs } from 'antd'
import { MailOutlined } from '@ant-design/icons';
import getConfig from 'next/config'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'

import { request } from '../lib/api'
import Repo from '../components/repo'

const { publicRuntimeConfig } = getConfig()
const { TabPane } = Tabs

const Index = ({ userRepos, userStared, user, router }) => {
  
  if(!user || !user.id) {
    return (
      <div className="root">
        <p>亲，您还没有登录哦~</p>
        <Button type="primary" href={publicRuntimeConfig.OAUTH_URL}>去登录</Button>
        <style jsx>{`
            .root {
              height: 400px;
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
            }
          `}</style>
      </div>
    )
  }

  const tabKey = router.query.key || '1'
  const handleTabChange = (activeKey) => {
    router.push(`/?key=${activeKey}`)
  }


  return (
    <div className="root">
      <div className="user-info">
        <img src={user.avatar_url} alt="user avatar" className="avatar" />
        <span className="login">{user.login}</span>
        <span className="name">{user.name}</span>
        <span className="bio">{user.bio}</span>
        <p className="email">
          <MailOutlined style={{ marginRight: 10 }} />
          <a href={`mailto: ${user.email}`}>{user.email}</a>
        </p>
      </div>
      <div className="user-repos">
        <Tabs activeKey={tabKey} onChange={handleTabChange} animated={false}>
          <TabPane tab="你的仓库" key="1">
            {userRepos.map(repo => {
              return <Repo repo={ repo } key={repo.id} />
            })}
          </TabPane>
          <TabPane tab="你关注的仓库" key="2">
            {userStared.map(repo => {
              return <Repo repo={ repo } key={repo.id} />
            })}
          </TabPane>
        </Tabs>
      </div>
      <style jsx>{`
        .root {
          display: flex;
          align-items: flex-start;
          padding: 20px 0px;
        }
        .user-info {
          width: 200px;
          margin-right: 40px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
        }
        .login {
          font-weight: 800;
          font-size: 20px;
          margin-top: 20px;
        }
        .name {
          font-size: 16px;
          color: #777;
        }
        .bio {
          margin-top: 20px;
          color: #333;
        }
        .avatar {
          width: 100%;
          border-radius: 5px;
        }
        .user-repos {
          flex-grow: 1;
        }
        `}</style>
    </div>
  )
}

Index.getInitialProps = async ({ ctx, reduxStore }) => {

  const user = reduxStore.getState().user
  if(!user || !user.id) {
    return {
      isLogin: false
    }
  }

  const userRepos = await request({
    url: 'user/repos'
  }, ctx.req, ctx.res)

  const userStared = await request({
    url: 'user/starred'
  }, ctx.req, ctx.res)

  return {
    isLogin: true,
    userRepos: userRepos.data || [],
    userStared: userStared.data || []
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(withRouter(Index))