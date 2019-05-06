const router = require('koa-router')()
//引入模型
const Person = require('../dbs/models/person')

router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

//新增接口
router.post('/addPerson', async function(ctx){
  const person = new Person({
    name: ctx.request.body.name,
    age: ctx.request.body.age
  });
  let code
  try {
    await person.save();
    code = 0
  } catch (e){
    code = -1
  }
  
  ctx.body = {
    code: code
  }
})

//查询
router.get('/getPerson', async function(ctx){
  let name = ctx.query.name;
  const result = await Person.findOne({name: ctx.query.name})

  const results = await Person.find({name:ctx.query.name})

  ctx.body = {
    result,
    results
  }

})

//更新
router.post('/updatePerson', async function(ctx){
  const result = await Person.find({
    name: ctx.request.body.name
  }).update({
    age: ctx.request.body.age
  })
  ctx.body = {
    result
  }
})

//删除
router.post('/removePerson', async function(ctx){
  const result = await Person.find({
    name: ctx.request.body.name
  }).remove()
  ctx.body = {
    result
  }
})

module.exports = router
