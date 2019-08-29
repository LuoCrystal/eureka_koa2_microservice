FROM hub.c.163.com/housan993/centos7_jdk8
VOLUME /tmp
ADD ./eureka_server.jar app.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]

EXPOSE 8761
