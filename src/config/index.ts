require('dotenv').config();

// create .env file 
const config = {
  env: process.env.NODE_ENV || 'development',
  port: 4000,
  mysql: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  // AWS S3 config
  files: {
    region: 'xx',
    accessKeyId: 'xx',
    secretAccessKey: 'x+x',
    bucketName: {
      development: 'xx',
      staging: 'xx',
      production: 'xx',
    }[process.env.NODE_ENV],
  },
  request: {
    development: {
      baseURL: 'http://dev-xx:8080/api/v2',
      key: 'xx',
      value: 'dev',
    },
    staging: {
      baseURL: 'http://stg-xx:8080/api/v2',
      key: 'xx',
      value: 'staging',
    },
    production: {
      baseURL: 'http://live-xx:8080/api/v2',
      key: 'xx',
      value: 'production',
    },
  }[process.env.NODE_ENV],
};

export default config;
