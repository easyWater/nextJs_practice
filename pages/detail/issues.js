import { Avatar, Button, Select, Spin } from 'antd'
import { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'

import withRepoBasic from '../../components/with-repo-basic'
import { request } from '../../lib/api'
import { getMomentDate } from '../../lib/utils'
import SearchUser from '../../components/searchUser'
const MdRenderer = dynamic(() => import('../../components/markdownRenderer'))

const CACHE = {}

function IssueDetail({ issue }) {
  return (
    <div className="root">
      <MdRenderer content={issue.body} />
      <div className="actions">
        <Button href={issue.html_url} target="_blank">打开Issue讨论页面</Button>
      </div>
      <style jsx>{`
        .root {
          background: #fafafa;
          padding: 20px;
        }
        .actions {
          text-align: right;
        }
        `}</style>
    </div>
  )
}

function Label({ label }) {
  return (
    <>
      <span className="label" style={{ background: `#${label.color}` }}>{label.name}</span>
      <style jsx>{`
        .label {
          display: inline-block;
          line-height: 20px;
          margin-left: 15px;
          padding: 3px 10px;
          border-radius: 3px;
          font-size: 14px;
        }
        `}</style>
    </>
  )
}

function IssueItem({ issue }) {

  const [showDetail, setShowDetail] = useState(false)

  const toggleShowDetail = useCallback(() => {
    setShowDetail(detail => !detail)
  }, [])

  return (
    <div>
      <div className="issue">
        <Button type="primary" size="small" style={{ position: 'absolute', right: '10px', top: '10px' }} onClick={toggleShowDetail}>
          { showDetail ? '隐藏' : '查看' }
        </Button>
        <div className="avatar">
          <Avatar src={issue.user.avatar_url} shape="square" size={50} />
        </div>
        <div className="main-info">
          <h6>
            <span>{issue.title}</span>
            { issue.labels && issue.labels.map(lb => <Label key={lb.id} label={lb} />) }
          </h6>
          <p className="sub-info">
            <span>Updated at {getMomentDate(issue.updated_at)}</span>
          </p>
        </div>
        <style jsx>{`
          .issue {
            display: flex;
            position: relative;
            padding: 10px;
          }
          .issue:hover {
            background: #fafafa;
          }
          .issue + .issue {
            border-top: 1px solid #eee;
          }
          .main-info > h6 {
            max-width: 600px;
            font-size: 16px;
            padding-right: 40px;
          }
          .avatar {
            margin-right: 20px;
          }
          .sub-info {
            margin-bottom: 0;
          }
          .sub-info > span + span {
            display: inline-block;
            margin-left: 20px;
            font-size: 12px;
          }
          `}</style>
      </div>
      { showDetail ? <IssueDetail issue={issue} /> : null }
    </div>
  )
}

function makeQuery(creator, state, label) {
  const creatorStr = creator ? `creator=${creator}` : ''
  const stateStr = state ? `state=${state}` : ''
  const labelStr = ''

  if(label && label.length) {
    labelStr = `label=${label.join(',')}`
  } 

  let queryArr = []

  if(creatorStr) queryArr.push(creatorStr)
  if(stateStr) queryArr.push(stateStr)
  if(labelStr) queryArr.push(labelStr)

  return `?${queryArr.join('&')}`
}

const isServer = typeof window === 'undefined'
const Option = Select.Option
const Issues = ({ initialIssues, labels = [], owner, name }) => {

  const [issues, setIssues] = useState(initialIssues)
  const [creator, setCreator] = useState()
  const [state, setState] = useState()
  const [label, setLabel] = useState([])
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    if(!isServer) CACHE[`${owner}/${name}`] = labels
  }, [owner, name, labels])

  const handleCreatorChange = useCallback(value => {
    setCreator(value)
  })

  const handleStateChange = useCallback(value => {
    setState(value)
  })

  const handleLabelChange = useCallback(value => {
    setLabel(value)
  })

  const handleSearch = useCallback(() => {
    setFetching(true)
    request({
      url: `repos/${owner}/${name}/issues${makeQuery(creator, state, label)}`
    }).then(res => {
      setIssues(res.data)
      setFetching(false)
    }).catch(err => {
      console.error(err)
      setFetching(false)
    })
  }, [owner, name, creator, state, label])
  
  return (
    <div className="root">
      <div className="search">
        <SearchUser value={creator} handleChange={handleCreatorChange} />
        <Select value={state} onChange={handleStateChange} style={{ width: 200, marginLeft: 20 }} placeholder="状态" allowClear={true}>
          <Option value="all">all</Option>
          <Option value="open">open</Option>
          <Option value="closed">closed</Option>
        </Select>
        <Select value={label} onChange={handleLabelChange} style={{ width: 200, flexGrow: 1, marginLeft: 20, marginRight: 20 }} mode="multiple" placeholder="Labels" allowClear={true}>
          { labels.map(lb => <Option value={lb.name} key={lb.id}>{lb.name}</Option>) }
        </Select>
        <Button type="primary" disabled={fetching} onClick={handleSearch}>筛选</Button>
      </div>
      { fetching ? <div className="loading"><Spin /></div> : (
        <div className="issues">
          { issues.map(issue => <IssueItem issue={issue} key={issue.id} />) }
        </div>
      ) }
      
      <style jsx>{`
        .issues {
          border: 1px solid #eee;
          border-radius: 5px;
          margin: 20px 0px;
        }
        .search {
          display: flex;
        }
        .loading {
          height: 400px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        `}</style>
    </div>
  )
}

Issues.getInitialProps = async ({ ctx }) => {

  const { owner, name } = ctx.query

  // const issuesRes = await request({
  //   url: `repos/${owner}/${name}/issues`
  // }, ctx.req, ctx.res)

  // const labelsRes = await request({
  //   url: `repos/${owner}/${name}/labels`
  // }, ctx.req, ctx.res)

  const fetch = await Promise.all([
    request({
      url: `repos/${owner}/${name}/issues`
    }, ctx.req, ctx.res),
    CACHE[`${owner}/${name}`] ? {data: CACHE[`${owner}/${name}`]} :
    request({
      url: `repos/${owner}/${name}/labels`
    }, ctx.req, ctx.res)
  ])

  return {
    initialIssues: fetch[0].data,
    labels: fetch[1].data,
    owner,
    name
  }
}

export default withRepoBasic(Issues, 'issues')