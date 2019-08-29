const router = require('koa-router')()

router.get('/healinfo', async function (ctx, next) {
    ctx.body = {'status':'UP','name': 'test'}
})

module.exports = router;