const axios = require('axios')
const http = require('http')
const https = require('https')

const isServer = typeof window === 'undefined'
const github_base_url = 'https://api.github.com'

async function requestGithub(method, url, data, headers) {
  let res = {}
  try {
    const response = await axios({
      method,
      url: `${github_base_url}/${url}`,
      data,
      headers,
      httpAgent: isServer ? new http.Agent({ keepAlive: true }) : '',
      httpsAgent: isServer ? new https.Agent({ keepAlive: true }) : '',
    })
    if(response) {
      res = response
    }
  }catch(err) {
    console.error(err)
  }

  return res  
}

async function request({method = 'GET', url, data = {}}, req, res) {
  if(!url) {
    throw Error('url must required')
  }

  if(isServer) {
    const headers = {}
    const session = req.session
    if(session && session.githubAuth) {
      headers['Authorization'] = `${session.githubAuth.token_type} ${session.githubAuth.access_token}`
    }

    return await requestGithub(method, url, data, headers)

  }else {
    return await axios({
      method, 
      url: `/github/${url}`,
      data
    })
  }
  
}

module.exports = {
  request,
  requestGithub
}