import MarkDownIt from 'markdown-it'
import 'github-markdown-css'
import { memo, useMemo } from 'react'

const md = new MarkDownIt({
  html: true,
  linkify: true
})

function bs64_to_utf8(str) {
  return decodeURIComponent(escape(atob(str)))
}

export default memo(function markdownRenderer({ content, isBase64 }) {
  const str = isBase64 ? bs64_to_utf8(content) : content
  const html = useMemo(() => md.render(str), [str])
  return (
    <div className="markdown-body">
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
  )
})