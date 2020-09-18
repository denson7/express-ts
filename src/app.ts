import express, { Application } from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import httpRequestContext from 'http-request-context';
import requestId from './middleware/requestId';
import routeLoader from './routes';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initDB();
    this.initMiddleware();
    this.initRouter();
  }

  public listen(port) {
    this.app.listen(port, () => {
      console.log(`App listening on the port ${port}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initMiddleware() {
    // add RequestId
    this.app.use(httpRequestContext.middleware());
    this.app.use(requestId);
    // 跨域
    this.app.use(cors());
    // 解析post数据
    this.app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  private initRouter() {
    routeLoader(this.app);
  }

  private initDB() {
    //
  }
}

export default App;
