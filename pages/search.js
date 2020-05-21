import { withRouter } from 'next/router'
import { Row, Col, List, Pagination } from 'antd'
import Link from 'next/link'
import { memo, isValidElement } from 'react'

import api from '../lib/api'
import Repo from '../components/repo'
import repo from '../components/repo'

const LANGUAGES = ['JavaScript', 'HTML', 'CSS', 'TypeScript', 'Java', 'Rust']
const SORT_TYPES = [
  {
    name: 'Best Match'
  },
  {
    name: 'Most Stars',
    value: 'stars',
    order: 'desc'
  },
  {
    name: 'Fewest Stars',
    value: 'stars',
    order: 'asc'
  },
  {
    name: 'Most Forks',
    value: 'forks',
    order: 'desc'
  },
  {
    name: 'Fewest Forks',
    value: 'forks',
    order: 'asc'
  },
]

const selectedItemStyle = {
  borderLeft: '2px solid #e36209',
  fontWeight: 100
}

const per_page = 20

function noop() {}

const FilterLink = memo(({ query, lang, sort, order, name, page }) => {

  let queryString = `?query=${query}`
  if(lang) queryString += `&lang=${lang}`
  if(sort) queryString += `&sort=${sort}&order=${order || 'desc'}`
  if(page) queryString += `&query=${page}`

  queryString += `&per_page=${per_page}`

  return (
    <Link href={`/search${queryString}`}>
      { isValidElement(name) ? name : <a>{name}</a> }
    </Link>
  )
})

function Search({ router, repos }) {
  console.log(repos)
  
  const { ...rest } = router.query
  const { lang, sort, order, page } = rest

  return (
    <div className="root">
      <Row gutter={20}>
        <Col span={6}>
          <List 
          header={<span className="list-header">语言</span>}
          bordered 
          style={{ marginBottom: '20px' }} 
          dataSource={LANGUAGES} 
          renderItem={item => {
            const selected = item === lang
            return (
              <List.Item style={ selected ?  selectedItemStyle : null }>
                { selected ? <span>{item}</span> : (
                  <FilterLink
                    {...rest}
                    name={item}
                    lang={item}
                  />
                ) }
              </List.Item>
            )
          }} />
          <List 
          header={<span className="list-header">排序</span>}
          bordered 
          dataSource={SORT_TYPES} 
          renderItem={item => {
            let selected = false
            if(!order && item.name === 'Best Match') {
              selected = true
            }else if(sort === item.value && order === item.order) {
              selected = true
            }
            return (
              <List.Item style={ selected ? selectedItemStyle : null }>
                { selected ? <span>{item.name}</span> : (
                  <FilterLink
                    {...rest}
                    name={item.name}
                    sort={item.value}
                    order={item.order}
                  />
                ) }
              </List.Item>
            )
          }} />
        </Col>
        <Col span={18}>
          <h3 className="repos-title">{repos.total_count} 个仓库</h3>
          { repos.items.map(repo => <Repo repo={repo} key={repo.id} />) }
          <div className="pagination">
            <Pagination
              pageSize={ 30 }
              current={ Number(page) || 1 }
              total={ repos.total_count > 1000 ? 1000 : repos.total_count }
              onChange={ noop }
              renderItem={ (page, type, ol) => {
                const name = type === 'page' ? page : ol
                const p = type === 'page' ? page : page === 'prev' ? page - 1 : page + 1
                return <FilterLink {...rest} name={name} page={p} />
              } }
            />
          </div>
        </Col>
      </Row>
      <style jsx>{`
        .root {
          padding: 20px 0px;
        }
        .list-header {
          font-weight: 800;
          font-size: 16px;
        }
        .repos-title {
          border-bottom: 1px solid #eee;
          font-size: 24px;
          line-height: 50px;
        }
        .pagination {
          padding: 20px;
          text-align: center;
        }
        `}</style>
    </div>
  )
}

Search.getInitialProps = async({ ctx }) => {

  const { query, lang, sort, order, page } = ctx.query

  if(!query){
    return {
      repos: {
        total_count: 0
      }
    }
  }

  let queryString = `?q=${query}`
  if(lang) queryString += `+language:${lang}`
  if(sort) queryString += `&sort=${sort}&order=${order || 'desc'}`
  if(page) queryString += `&page=${page}`

  queryString += `&per_page=${per_page}`

  const result = await api.request({
    url: `search/repositories${queryString}`
  }, ctx.req, ctx.res)

  return {
    repos: result.data || {}
  }
}

export default withRouter(Search)