import mysql from 'mysql';
import async from 'async';
import logger from './logger';
import config from '../config';

// 连接池
const pool = mysql.createPool({
  ...config.mysql,
  connectionLimit: 100,
  queueLimit: 0,
  connectTimeout: 10000,
});

const handleDisconnect = () => {
  const connection = mysql.createConnection(config.mysql);

  connection.connect((err) => {
    if (err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 1000);
    }
  });
  connection.on('error', (err) => {
    console.log('handleDisconnect :: db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR' || err.code === 'ETIMEDOUT') {
      console.log('it is reconnection ...');
      handleDisconnect();
    } else {
      // connnection idle timeout
      throw err;
    }
  });
  return connection;
};

const exec = (sql: string, val: any = ''): Promise<any> => {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err);
      } else {
        const query = connection.query(sql, val, (err, results, fields) => {
          if (err) {
            reject(err);
          } else {
            // Remove the RowDataPacket before each data
            const data = JSON.stringify(results);
            resolve(JSON.parse(data));
          }
          // release connection resources
          connection.release();
        });
        // print sql
        logger.info('\n SQL----->', query.sql);
      }
    });
  });
};

const connect = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        resolve(connection);
      }
    });
  });
};

// mutli query sql with one transaction
const execTransaction = (arr) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }
      // begin transaction
      connection.beginTransaction((err) => {
        if (err) {
          reject(err);
        }
        const list = [];
        arr.map((item) => {
          const temp = (cb) => {
            const { sql, params } = item;
            const query = connection.query(sql, params, (error, rows, fields) => {
              if (error) {
                connection.rollback(() => {
                  reject(error);
                });
              } else {
                return cb(null, JSON.parse(JSON.stringify(rows)));
              }
            });
            // print SQL
            // logger.info('SQL:', query.sql);
          };
          list.push(temp);
        });
        // promise.all()
        async.series(list, (error, result) => {
          if (error) {
            connection.rollback(() => {
              console.log('transaction error');
              connection.release();
              reject(error);
            });
          } else {
            // commit
            connection.commit((error) => {
              if (error) {
                connection.rollback(() => {
                  connection.release();
                  reject(error);
                });
              } else {
                connection.release();
                resolve(result);
              }
            });
          }
        });
      });
    });
  });
};

const execStreamQuery = (sql: string, val: any = ''): Promise<any> => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      const query = connection.query(sql, val);
      const data = [];
      query
        .on('error', (err) => {
          logger.info('execStreamQuery-err' + err.message);
          // process.exit();
          reject(err);
        })
        .on('fields', (fields) => {
          //
        })
        .on('result', (row) => {
          connection.pause();
          const _row = JSON.parse(JSON.stringify(row));
          data.push(_row);
          setTimeout(() => {
            connection.resume();
          }, 10);
        })
        .on('end', () => {
          resolve(data);
          connection.release();
        });
    });
  });
};

/**
 *
 await transaction(async connection => {
  await connection.query('...');
  await connection.query('...');
 });
 * @param callback
 */
export const transaction = async (callback) => {
  const connection = await connect();
  await connection.beginTransaction();
  const execute = (sql: string, val: any = ''): Promise<any> => {
    return new Promise((resolve, reject) => {
      const query = connection.query(sql, val, (err, results, fields) => {
        if (err) {
          reject(err);
        } else {
          const data = JSON.stringify(results);
          resolve(JSON.parse(data));
        }
      });
      logger.info('\n SQL----->', query.sql);
    });
  };
  try {
    await callback(connection, execute);
    await connection.commit();
    logger.info('transaction commit');
  } catch (err) {
    logger.info('transaction rollback', err);
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

export { handleDisconnect as dbConn, exec, connect, execTransaction, pool, execStreamQuery };
