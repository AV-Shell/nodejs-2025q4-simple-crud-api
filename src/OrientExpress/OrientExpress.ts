/* eslint-disable node/no-unsupported-features/node-builtins */

import http from 'http';
import config from '../common/config';
import { myReq, myRes, TErrorHandler, TMiddleWare, TNextFunction } from '../common/types.d';
import { MyCustomError } from '../common/myCustomError';

class Application {
  public readonly server: http.Server;
  public readonly middlewares: TMiddleWare[];
  public errorHandler: TErrorHandler;

  constructor() {
    this.server = this._createServer();
    this.middlewares = [];
    this.errorHandler = null;
  }

  use(middleware: TMiddleWare) {
    this.middlewares.push(middleware);
  }

  static _json = (res: myRes): void => {
    res.json = (data, statusCode = 200) => {
      res.writeHead(statusCode, {
        'Content-type': 'application/json',
      });
      res.end(JSON.stringify(data));
    };
  };

  static _parseUrl(req: myReq): void {
    const parsedUrl = new URL(req.url ?? '', `http://${req.headers.host}`);
    if (config?.DEBUG) {
      console.log('parsedUrl', parsedUrl);
    }
    req.parsedUrl = parsedUrl;
  }

  _createServer(): http.Server {
    return http.createServer((req: myReq, res: myRes) => {
      Application._parseUrl(req);
      Application._json(res);
      let body = '';
      let isRunNext = true;
      const next: TNextFunction = () => {
        isRunNext = true;
      };
      req.on('data', (partOfData) => {
        body += partOfData;
      });
      req.on('end', async () => {
        if (body) {
          req.body = body;
        }
        let midCount = 0;
        while (midCount < this.middlewares.length && isRunNext) {
          isRunNext = false;
          try {
            if (config?.DEBUG) {
              console.log('try middleware', this.middlewares[midCount]?.length);
            }
            await this.middlewares?.[midCount]?.(req, res, next);
          } catch (err) {
            if (err instanceof Error) {
              if (config?.DEBUG) {
                console.log('i catch error', err.message);
              }
              if (this.errorHandler && typeof this.errorHandler === 'function') {
                this.errorHandler(err, req, res);
              } else {
                throw err;
              }
            }
          }
          midCount++;
        }
        if (isRunNext) {
          res.json?.(`human friendly: No endpoints!  ¯\\_(ツ)_/¯`, 404);
        }
      });
    });
  }

  listen(port: number, cb: () => void) {
    this.server.listen(port, cb);
  }

  setErrorHandler(cb: TErrorHandler) {
    this.errorHandler = cb;
  }

  static bodyParser: TMiddleWare = (req: myReq, _: myRes, next: () => void) => {
    try {
      if (config?.DEBUG) {
        console.log('bodyPArser');
        console.log('req.body', req.body);
        if (req.body && typeof req.body === 'string') {
          console.log('JSON.parse(req.body)', JSON.parse(req.body));
        }
      }
      if (req.body && typeof req.body === 'string') {
        req.body = JSON.parse(req.body);
      }
      if (config?.DEBUG) {
        console.log('req.body', req.body);
      }
    } catch (error) {
      throw new MyCustomError('"Body is not valid JSON', 500);
    }

    next();
  };
}

export default Application;
