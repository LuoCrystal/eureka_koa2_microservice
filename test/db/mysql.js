const mysql = require('mysql')
const { MYSQL_CONF } = require('../config/db.js')

const pool = mysql.createPool(MYSQL_CONF);

var exec=function(sql){
    const promise = new Promise((resolve,reject)=>{
        pool.getConnection(function(err,conn){
            if(err){
                console.error(err)
                reject(err)
                return;
                // callback(err,null,null);
            }else{
                conn.query(sql,function(err,vals,fields){
                    //释放连接
                    // conn.release();
                    pool.releaseConnection(conn);
                    console.log("创建数据库调用")
                    if(err){
                        console.error(err)
                        reject(err)
                        return;
                    }else{
                        resolve(vals)
                    }
                });
            }
        });
    });
    return promise
};

module.exports = {
    exec,
    escape: mysql.escape
}