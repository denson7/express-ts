import Log4js, { configure, getLogger } from 'log4js';
import path from 'path';

// 日志根目录
const basePath = path.resolve(__dirname, '../../logs');

// 自定义日志输出目录
const errorPath = '/error/';
const errorFileName = 'error';
const errorLogPath = basePath  + errorPath + errorFileName;

// 其他信息
const infoPath = '/info/';
const infoFileName = 'info';
const infoLogPath = basePath + infoPath + infoFileName;

const options = {
  // 日志格式
  appenders: {
    std: { type: 'stdout', level: 'all', layout: { type: 'basic' } },
    console: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '%[%d %p%] %m%n'
      }
    },
    file: {
      type: 'dateFile',
      // filename: path.join(path.resolve(__dirname, '../../'), 'logs/info'),
      filename: infoLogPath,
      alwaysIncludePattern: true,
      maxLogSize: 10 * 1024 * 1024, // file max size
      daysToKeep: 5, // save time
      pattern: 'yyyy_MM_dd.log'
    },
    error: {
      type: 'dateFile', // 日志输出到文件
      filename: errorLogPath, // 日志文件输出路径
      pattern: 'yyyy_MM_dd.log',
      encoding: 'utf-8', // 编码格式,默认utf-8
      alwaysIncludePattern: true, // 始终展示预设的pattern
      maxLogSize: 10 * 1024 * 1024, // 最大10M
      daysToKeep: 5, // 保存时间
      compress: true // 超过maxLogSize,压缩文件
    }
  },
  pm2: true,
  // 外部调用名称
  categories: {
    default: { appenders: ['std'], level: 'all' },
    app: { appenders: ['file'], level: 'all' },
    error: { appenders: ['error'], level: 'all' }
  }
};

// 加载配置文件
Log4js.configure(options);

// 调用
const koaLogger = getLogger('app');
const errorLogger = getLogger('error');

// logger.addContext('version', `V.1.0.0`);
// 设置layout, 定义每条日志的输出格式
// 例如:(pattern: '%d %p %c %x{version} %m%n') %d、%p、%n 等表示的是日志系统中的变量，
// %d 指的是日期时间
// %p 指的是日志等级
// %x{version} 指的是将动态变量
// %n 指的是换行
// layout: {
//   type: 'pattern',
//   pattern: '%[[%X{version}] %d %p%] %m%n',
// },

// 自定义封装
const logger = {
  info: (info: any, ...args: any) => koaLogger.info(info, ...args),
  debug: (info: any, ...args: any) => koaLogger.debug(info, ...args),
  trace: (info: any, ...args: any) => koaLogger.trace(info, ...args),
  warn: (info: any, ...args: any) => koaLogger.warn(info, ...args),
  error: (info: any, ...args: any) => errorLogger.error(info, ...args),
  fatal: (info: any, ...args: any) => errorLogger.fatal(info, ...args)
};
export default logger;
