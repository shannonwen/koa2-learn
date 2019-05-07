const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')
const users = require('./routes/users')

const mongoose = require('mongoose')
const dbConfig = require('./dbs/config')

const session = require('koa-generic-session')
const Redis = require('koa-redis')

const pv = require('./middleware/koa-pv')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(pv())

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

//连接mongodb
mongoose.connect(dbConfig.dbs,{
  useNewUrlParser: true
})

//session处理
app.keys = ['keys', 'keyskeys']
// app.use(session({
//   key: 'wlx',
//   prefix: 'mtpr',
//   store: new Redis()
// }))


app.use( async ( ctx ) => {
  // 设置session
  if ( ctx.url === '/set' ) {
	ctx.session = {
	  user_id: Math.random().toString(36).substr(2),
	  count: 0
	}
	ctx.body = ctx.session
  } else if ( ctx.url === '/' ) {
 
	// 读取session信息
	ctx.session.count = ctx.session.count + 1
	ctx.body = ctx.session
  }
})


// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
