import { cloneElement } from 'react'

const style = {
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  paddingLeft: '20px',
  paddingRight: '20px'
}

export default ({ children,  renderer = <div />}) => {
  return cloneElement(renderer, {
    style: Object.assign({}, renderer.props.style, style),
    children
  })
}