import { useState, useCallback } from 'react'
import Link from 'next/link'
import getConfig from 'next/config'
import { connect } from 'react-redux'
import axios from 'axios'
import { withRouter } from 'next/router'
import { Button, Layout, Input, Avatar, Tooltip, Dropdown, Menu } from 'antd'
import { GithubOutlined, UserOutlined } from '@ant-design/icons';

import Container from './container'
import { logout } from '../store/store'

const { Header, Content, Footer } = Layout
const { publicRuntimeConfig } = getConfig()

const githubIconStyle = {
  color: 'white',
  fontSize: 40,
  display: 'block',
  paddingTop: 10,
  marginRight: 20
}

const footerStyle = {
  textAlign: 'center'
}

const MyLayout = ({ children, user, logout, router }) => {

  const [search, setSearch] = useState('')

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value)
  }, [])

  const handleOnSearch = useCallback(() => {}, [])

  const handleLogout = useCallback(() => {
    logout()
  }, [logout])

  // const handleAuthUrl = useCallback((e) => {
  //   e.preventDefault()
  //   axios.get(`/prepare-auth?url=${router.asPath}`).then(res => {
  //     if(res.status === 200) {
  //       location.href = publicRuntimeConfig.OAUTH_URL
  //     }else {
  //       console.log('prepare auth failed', res)
  //     }
  //   }).catch(err => {
  //     console.log('prepare auth failed', err)
  //   })
  // }, [])

  const userDropMenu = (
    <Menu>
      <Menu.Item>
        <span onClick={handleLogout}>登 出</span>
      </Menu.Item>
    </Menu>
  )

  return (
    <Layout>
      <Header>
        <Container renderer={<div className="header-inner"></div>}>
          <div className="header-left">
            <div className="icon">
              <GithubOutlined style={githubIconStyle} />
            </div>
            <div className="search-input">
              <Input.Search placeholder='搜索仓库' value={search} onChange={handleSearchChange} onSearch={handleOnSearch}/>
            </div>
          </div>
          <div className="header-right">
            <div className="user">
              {
                user && user.id ? (
                  <Dropdown overlay={userDropMenu}>
                    <a href='/'>
                      <Avatar size={40} src={user.avatar_url} />
                    </a>
                  </Dropdown>
                ) : (
                  <Tooltip title='点击登录'>
                    <a href={`/prepare-auth?url=${router.asPath}`}>
                      <Avatar size={40} icon={<UserOutlined />} />
                    </a>
                  </Tooltip>
                )
              }
            </div>
          </div>
        </Container>
      </Header>
      <Content>
        <Container>
          {children}
        </Container>
      </Content>
      <Footer style={footerStyle}>
        Develop by easy_water @<a href='mailto:easy_water@126.com'>easy_water@126.com</a>
      </Footer>
      <style jsx>{`
        .header-inner {
          display: flex;
          justify-content: space-between;
        }
        .header-left {
          display: flex;
          justify-content: flex-start;
        }
        .search-input {

        }
      `}</style>
      <style jsx global>{`
          #__next {
            height: 100%;
          }
          .ant-layout {
            height: 100%;
          }
          .ant-layout-header {
            padding-left: 0px;
            padding-right: 0px;
          }
        `}</style>
    </Layout>
  )
}

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(logout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MyLayout))