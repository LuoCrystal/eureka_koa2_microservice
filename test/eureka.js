const os = require('os')
const interfaces = os.networkInterfaces(); // 在开发环境中获取局域网中的本机iP地址
let IPAdress = '';
for(var devName in interfaces){  
  var iface = interfaces[devName];  
  for(var i=0;i<iface.length;i++){  
        var alias = iface[i];  
        if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){  
              IPAdress = alias.address;  
        }  
  }  
} 
const port = require('./config').port;
const Eureka = require("eureka-js-client").Eureka;
const eureka_client = new Eureka({
    filename: 'eureka-client',
    cwd: __dirname,
    eureka:{
        heartbeatInterval: 30000,
        registryFetchInterval: 30000,
        host: 'localhost',
        port: 8761,
        servicePath: '/eureka/apps/'
    },
    instance:{
        app: 'test',
        hostName: IPAdress,
        ipAddr: IPAdress,
        preferIpAddress: true,
        instanceId: `${IPAdress}:${port}`,
        statusPageUrl: `http://${IPAdress}:${port}`,
        healthCheckUrl: `http://${IPAdress}:${port}/healthcheck`,
        port:{
            '$': port,
            '@enabled': 'true'
        },
        vipAddress: 'test',
        dataCenterInfo:{
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn'
        }
    }
});
eureka_client.logger.level('debug');
eureka_client.start(function(error){
    console.log(error || 'complete');
});
module.exports={
	eureka_client
}