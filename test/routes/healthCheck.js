const router = require('koa-router')()

router.get('/healthcheck', async function (ctx, next) {
    ctx.body = {'status':'UP'}
})

module.exports = router;