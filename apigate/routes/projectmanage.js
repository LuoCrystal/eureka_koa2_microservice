const router = require('koa-router')()
const request = require('request');
const util = require('util')
const requestPromise = util.promisify(request);
const {getip} = require('../scripts/getip.js')
const {eureka_client} = require('../eureka.js')

router.get('/api/projects', async function (ctx, next) {
    const requesturl = getip(eureka_client,"test")
    console.log(requesturl)
    const options = {
        url: `${requesturl}/api/test`,
        method: "GET",
        json: true,
        headers: {
          "content-type": "application/json",
        }
      };
    
      const {response, body} = await requestPromise(options);
      console.log(body)
      ctx.body = body;
})

module.exports = router;