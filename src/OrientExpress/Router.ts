/* eslint-disable no-else-return */
import config from '../common/config';
import { TMiddleWare, IParams, TMyHandler } from '../common/types.d';

type TMyMethod = (path: string, handler: TMyHandler) => void;

type TAmethods = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface IEMethods {
  [keys: string]: TMyHandler | null;
}

interface IEndpoints {
  [keys: string]: IEMethods;
}

class Router {
  public endpoints: IEndpoints;
  public requestPaths: string[];
  public readonly middleware: TMiddleWare;

  constructor() {
    this.endpoints = {};
    this.requestPaths = [];
    this.middleware = (req, res, next) => this._middleware(req, res, next);
  }

  static parsePath(path: string): { path: string } {
    return { path };
  }

  setRequestHandler(method: TAmethods, path: string, handler: TMyHandler) {
    if (config?.DEBUG) {
      console.log(`method ${method}, path ${path}, handler: ${handler?.name}`);
    }
    const parsedPath = Router.parsePath(path);
    if (!this.endpoints[parsedPath.path]) {
      this.endpoints[parsedPath.path] = { DELETE: null, GET: null, POST: null, PUT: null };
    }
    const endpoint = this.endpoints[parsedPath.path];

    if (endpoint) {
      if (endpoint?.[method]) {
        console.error(`Method "${method}" in endpoint "${parsedPath.path}" is already exist`);
      } else {
        endpoint[method] = handler;
        this.requestPaths = Object.keys(this.endpoints);
        if (config?.DEBUG) {
          console.log(`Object.keys(this.endpoints); method(${method})`, this.requestPaths);
        }
      }
    }
  }

  static comparePath(storedPath: string, incomingPath: string): IParams | null {
    if (config?.DEBUG) {
      console.log('storedPath', storedPath);
      console.log('incomingPath', incomingPath);
    }
    if (typeof storedPath !== 'string' || typeof incomingPath !== 'string') {
      if (config?.DEBUG) {
        console.log('some path invalid');
      }
      return null;
    }

    const splitSP = storedPath?.split('/');
    const splitIP = incomingPath?.split('/');
    if (splitSP.length !== splitIP.length) {
      return null;
    }
    const params: { [keys: string]: string } = {};
    if (
      splitSP.every((el, i) => {
        const keyIP = splitIP[i];
        if (el[0] === ':' && el.length > 1) {
          const key = `${el.slice(1)}`;

          if (keyIP) {
            params[key] = keyIP;
            return true;
          }
          return false;
        } else if (el === keyIP) {
          return true;
        }
        return false;
      })
    ) {
      return params;
    }
    return null;
  }

  _middleware: TMiddleWare = async (req, res, next) => {
    if (config?.DEBUG) {
      console.log('middleware, this.requestPaths', this.requestPaths);
    }
    let midFunc: TMyHandler | null = null;

    const objectEnties = Object.entries(this.endpoints);

    for (let i = 0; i < objectEnties.length; i++) {
      const trat = objectEnties[i];

      if (trat) {
        const [path, endpoint] = trat;
        if (config?.DEBUG) {
          console.log('middleware path find', path);
        }
        const params: IParams | null = Router.comparePath(path, req?.parsedUrl?.pathname ?? '');
        if (params) {
          if (config?.DEBUG) {
            console.log('Yeaaa!!!');
            console.log('params', params);

            console.log('method', req.method);
            console.log('this.endpoints[path]', this.endpoints[path]);
            console.log('this.endpoints[path]?.[req.method]', this.endpoints[path]?.[req?.method ?? '']);
          }

          const method = req?.method ?? 'undefined';

          const mustacheHandler = endpoint[method];
          if (config?.DEBUG) {
            console.log('mustacheHandler', mustacheHandler);
            console.log('typeof mustacheHandler', typeof mustacheHandler);
            console.log(
              "(mustacheHandler && typeof mustacheHandler === 'function')",
              mustacheHandler && typeof mustacheHandler === 'function',
            );
          }
          if (mustacheHandler && typeof mustacheHandler === 'function') {
            req.params = params;
            if (config?.DEBUG) {
              console.log('mustacheHandler', mustacheHandler);
            }
            midFunc = mustacheHandler;
            break;
          }
        }
      }
    }

    if (midFunc) {
      await midFunc(req, res);
      return;
    }
    next();
  };

  get: TMyMethod = (path, handler) => {
    this.setRequestHandler('GET', path, handler);
  };

  post: TMyMethod = (path, handler) => {
    this.setRequestHandler('POST', path, handler);
  };

  put: TMyMethod = (path, handler) => {
    this.setRequestHandler('PUT', path, handler);
  };

  delete: TMyMethod = (path, handler) => {
    this.setRequestHandler('DELETE', path, handler);
  };
}

export default Router;
