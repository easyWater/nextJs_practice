import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Button, Layout, Input, Avatar } from 'antd'
import { GithubOutlined, UserOutlined } from '@ant-design/icons';

import Container from './container'

const { Header, Content, Footer } = Layout

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

const Comp = ({ color, children, style }) => <div style={{color, ...style}}>{children}</div> 

export default ({ children }) => {

  const [search, setSearch] = useState('')

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value)
  }, [])

  const handleOnSearch = useCallback(() => {}, [])

  return (
    <Layout>
      <Header>
        <div className="header-inner">
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
              <Avatar size={40} icon={<UserOutlined />} />
            </div>
          </div>
        </div>
      </Header>
      <Content>
        <Container renderer={<Comp color="red" />}>
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
        `}</style>
    </Layout>
  )
}