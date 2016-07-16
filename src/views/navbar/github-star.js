/* eslint max-len: 0 */
import React from 'react'

const RAW_HTML = `
  <iframe
    src="https://ghbtns.com/github-btn.html?user=iam4x&repo=pokemongo-webspoof&type=star&count=true&size=large"
    frameborder="0"
    scrolling="0"
    width="160px"
    height="30px">
  </iframe>
`

const GithubStar = () =>
  <div
    className='github-star'
    dangerouslySetInnerHTML={ { __html: RAW_HTML } } />

export default GithubStar
