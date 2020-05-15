import { cloneElement } from 'react'

const style = {
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto'
}

export default ({ children,  renderer}) => {
  return cloneElement(renderer, {
    style,
    children
  })
}