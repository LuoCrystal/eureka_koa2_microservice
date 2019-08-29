const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()

const co = require('co')
const convert = require('koa-convert')
const json = require('koa-json')
const onerror = require('koa-onerror')
// const bodyparser = require('koa-bodyparser')
const koabody = require('koa-body')
const logger = require('koa-logger')
// const debug = require('debug')('koa2:server')
const path = require('path')
// const fs = require('fs')
// const morgan = require('koa-morgan')
const cors = require('koa2-cors')

const config = require('./config')

const {eureka_client} = require('./eureka.js')

//路由文件
const healthcheck = require('./routes/healthCheck')
const healthinfo = require('./routes/healthInfo')


const port = process.env.PORT || config.port
// error handler
onerror(app)

// middlewares
app.use(require('koa-static')(__dirname + '/public'))
  .use(koabody({
    enableTypes:['json','form','text','png','jpg','jpeg','gif'],
    multipart:true,
    formidable:{
      uploadDir:path.join(__dirname,'/public/upload/news'),
      keepExtensions:true,
      maxFieldsSize:200 * 1024 * 1024,
      maxFields:999999
    },
    formLimit:"5mb",
    jsonLimit:"15mb",
    textLimit:"5mb"
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
router.get("/api/test",async function(ctx,next){
  ctx.body="hello world"
})

app.use(router.routes(),router.allowedMethods())
app.use(healthcheck.routes(),healthcheck.allowedMethods())
app.use(healthinfo.routes(),healthinfo.allowedMethods())

app.on('error', function(err, ctx) {
  console.log(err)
  logger.error('server error', err, ctx)
})

module.exports = app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
  
})
