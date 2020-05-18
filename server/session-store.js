function getRedisSessionId(sid) {
  return `ssId:${sid}`
}

class RedisSessionStore {

  constructor(client) {
    this.client = client
  }

  //从redis中获取session
  async get(sid) {
    const id = getRedisSessionId(sid)
    // console.log('get session', id)
    const data = await this.client.get(id)
    if(!data) {
      return null
    }
    try {
      const result = JSON.parse(data)
      return result
    }catch(err) {
      console.err(err)
    }

  }

  //将session存入redis
  async set(sid, sess, ttl) {
    const id = getRedisSessionId(sid)
    // console.log('set session', id)
    if(typeof ttl === 'number') {
      ttl = Math.ceil(ttl / 1000)
    }
    try {
      const sessionStr = JSON.stringify(sess)
      if(ttl) {
        await this.client.setex(id, ttl, sessionStr)
      }else {
        await this.client.set(id, sessionStr)
      }
    }catch(err) {
      console.err(err)
    }
  }

  //根据key删除session
  async destroy(sid) {
    const id = getRedisSessionId(sid)
    // console.log('destroy session', id)
    await this.client.del(id)
  }
}

module.exports = RedisSessionStore