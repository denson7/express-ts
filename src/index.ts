import App from './app';
import logger from './utils/logger';

process.on('uncaughtException', (error) => {
  logger.debug(`Uncaught Error: ${JSON.stringify({ ...error })}`);
});

const app = new App();
app.listen(3003);
