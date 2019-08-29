const address = {};
const indexs = {}; // 用于存放各个服务轮询的指针

function loadBalance(type, serviceName) {
    let result;
    const ips = address[serviceName];
    if (type === 'random') {
      const index = Math.floor(Math.random() * ips.length);
      result = ips[index];
    } else if (type === 'roundRobin') {
      if (!indexs[serviceName]) {
        indexs[serviceName] = 0;
      } else if (indexs[serviceName] >= ips.length) {
        indexs[serviceName] = 0;
      }
      result = address[serviceName][indexs[serviceName]];
      indexs[serviceName] += 1;
    }
    return result;
  }

function getip(client,app) {
    const balanceType = 'roundRobin';
    // 初次请求该实例,直接将对应的实例信息存入address中
    const instances = client.getInstancesByAppId(app);
    const ips = [];
    instances.forEach((instance) => {
      const ip = instance.ipAddr;
      const port = instance.port.$;
      if (instance.status === 'UP') {
        const target = `http://${ip}:${port}`;
        ips.push(target);
      }
    });
    console.log("获取到的服务列表")
    console.log(ips)
    address[app] = ips;

    if (ips.length === 0) throw new Error(`not found able service registered: ${app}`);
  
    const target = loadBalance(balanceType, app);
    return target;
  }

module.exports = {
    getip
}