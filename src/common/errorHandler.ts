import { MyCustomError } from './myCustomError';
import config from './config';
import { myReq, myRes } from './types.d';

function exceptionHandler(err: Error) {
  console.error(err.message);
  process.exit(9);
}

export const uncaughtExceptionHandler = (err: Error) => {
  exceptionHandler(err);
};

export const unhandledRejectionHandler = (err: Error) => {
  exceptionHandler(err);
};

export const errorHandler = (err: Error, _: myReq, res: myRes) => {
  if (err instanceof MyCustomError) {
    res?.json?.(err?.message, err.myErrStatus);
    if (config?.DEBUG) {
      console.log('custom error, status', err.myErrStatus);
      console.log('custom error, message', err.message);
    }
    return;
  }
  res?.json?.('Something wrong', 500);
};
