const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const scope = 'user'
const client_id = 'Iv1.aef009b72b064c18'

module.exports = {
  github: {
    client_id,
    client_secret: 'ef5c1227504f73f40a51e8746b1efb09a8c52b47',
    get_token_url: 'https://github.com/login/oauth/access_token'
  },
  GITHUB_OAUTH_URL,
  OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${client_id}&scope=${scope}`
}

//access_token = b8dcf37c82116b87cbc0d84741e56642bf7fabd1