import mysql from 'mysql';
import config from 'config';

// 连接池
const pool = mysql.createPool({
  host: config.get('mysql.host'),
  port: 3306,
  user: config.get('mysql.user'),
  password: config.get('mysql.password'),
  database: config.get('mysql.database'),
  connectionLimit: 100,
  queueLimit: 0,
  connectTimeout: 10000,
});

const exec = (sql: string, val: any) => {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err);
      } else {
        connection.query(sql, val, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
          // 释放连接资源
          connection.release();
        });
      }
    });
  });
};

export { exec };
