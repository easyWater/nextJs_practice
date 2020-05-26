import { Select, Spin } from 'antd'
import { useState, useCallback, useRef } from 'react'
import debounce from 'lodash/debounce'

import { request } from '../lib/api'

const Option = Select.Option

function SearchUser({ value, handleChange }) {

  const [fetching, setFetching] = useState(false)
  const [options, setOptions] = useState([])
  const lastFetchId = useRef(0)

  const fetchUser = useCallback(debounce((val) => {
    
    if(!val) return

    lastFetchId.current += 1
    const fId = lastFetchId.current
    setFetching(true)
    setOptions([])
    request({
      url: `search/users?q=${val}`
    }).then(res => {

      if(fId !== lastFetchId.current) {
        return
      }

      const data = res.data.items.map(item => {
        return {
          value: item.login,
          text: item.login
        }
      })
      
      setOptions(data)
      setFetching(false)
    })
  }, 500))

  const handleSelChange = val => {
    setFetching(false)
    setOptions([])
    handleChange(val)
  }

  return (
    <Select 
    style={{ width: '200px' }}
    showSearch={true}
    notFoundContent={ fetching ? <Spin size="small" /> : <span>nothing</span> } 
    filterOption={false}
    placeholder="创建者"
    onSearch={fetchUser}
    value={value}
    onChange={handleSelChange}
    allowClear={true}
    >
      {
        options.map(op => {
          return (
            <Option value={op.value} key={op.value}>{op.text}</Option>
          )
        })
      }
    </Select>
  )
}

export default SearchUser