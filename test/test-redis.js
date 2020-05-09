async function test() {
  const Redis = require('ioredis')

  const redis = new Redis({ //redis客户端实例
    port: 6378,
    password: 666666
  })

  //操作数据库是异步的用await/promise
  await redis.set('c', 666) //设置
  await redis.setex('d', 10, 'aaa')
  const keys = await redis.keys('*') //获取
  console.log(keys)
  console.log(await redis.get('c'))
}

test()