const {eureka_client} = require('./eureka.js')
eureka_client.start(function(error){
  console.log(error || 'complete');
  const Koa = require('koa')
  const Router = require('koa-router')
  const app = new Koa()
  const router = new Router()

  const co = require('co')
  const convert = require('koa-convert')
  const json = require('koa-json')
  const onerror = require('koa-onerror')
  const bodyparser = require('koa-bodyparser')
  const logger = require('koa-logger')
  // const debug = require('debug')('koa2:server')
  const path = require('path')
  // const fs = require('fs')
  // const morgan = require('koa-morgan')
  const cors = require('koa2-cors')
  const {getip} = require('./scripts/getip.js')
  const config = require('./config')

  //路由文件
  //健康检查
  const healthcheck = require('./routes/healthCheck')
  const healthinfo = require('./routes/healthInfo')

  //api路由
  const projectmanage = require('./routes/projectmanage')


  const port = process.env.PORT || config.port
  // error handler
  onerror(app)

  // middlewares
  app.use(require('koa-static')(__dirname + '/public'))
    .use(bodyparser({
      enableTypes:['json','form','text']
    }))
    .use(json())
    .use(logger())

  // logger
  app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - $ms`)
  })
    
  //跨域设置
  app.use(cors({
    origin: function (ctx) {
        return '*';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST','PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept','x-requested-with'],
  }))



  //routes设置
  app.use(healthcheck.routes(),healthcheck.allowedMethods())
  app.use(healthinfo.routes(),healthinfo.allowedMethods())

  //api路由设置
  app.use(projectmanage.routes(),projectmanage.allowedMethods())

  app.on('error', function(err, ctx) {
    console.log(err)
    logger.error('server error', err, ctx)
  })

  app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
  })
});

