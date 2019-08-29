# eureka_koa2_microservice
用**eureka**做服务注册发现，依赖**eureka-js-client**，获取ip时并进行了简单的负载均衡（轮询或随机），koa2+request做api网关。

## 内容简介
eureka_server文件夹存放eureka服务端代码，依赖于springcloud，直接用idea下载完整eureka项目即可。

Apigate是api网关，包含了一个eureka客户端
Test是测试的微服务


初次接触微服务，因为不会java，所以自己摸索的瞎弄了一个项目结构，不求高大上，只求能实现功能并能交付。

