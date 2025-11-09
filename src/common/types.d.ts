/* eslint-disable @typescript-eslint/no-explicit-any */

import { ServerResponse, IncomingMessage } from 'http';

export type myAny = any;

interface IParams {
  [keys: string]: string;
}

export interface myRes extends ServerResponse {
  json?: (data: myAny, statusCode?: number) => void;
}

export interface myReq extends IncomingMessage {
  parsedUrl?: URL;
  body?: string | object;
  params?: IParams;
}

export type TErrorHandler = ((err: Error, req: myReq, res: myRes) => any) | null;
export type TMiddleWare = (req: myReq, res: myRes, next: any) => any;
export type TNextFunction = () => void;

export type TMyHandler = (req: myReq, res: myRes, next?: any) => any;

export type TCatchError = Error | any;
