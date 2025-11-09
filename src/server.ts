import cluster from 'cluster';
import os from 'os';
import http, { ServerResponse, IncomingMessage } from 'http';
import config from './common/config';
import app from './app';

interface IPortC {
  basePort: number;
  shift: number;
  maxShift: number;
}

const currentWorkerPort: IPortC = {
  basePort: +config.PORT,
  shift: 0,
  maxShift: 0,
};

if (config.MULTIMODE) {
  const createProxy = (portContainer: IPortC, cp?: number) => (req: IncomingMessage, res: ServerResponse) => {
    let postData = '';

    portContainer.shift = (portContainer.shift + 1) % portContainer.maxShift;

    if (cluster.isWorker) {
      console.log('PID:', process.pid, ' on port', cp, '; request url:', req.url);
    }

    const portTo = cluster.isWorker
      ? portContainer.basePort - 1
      : portContainer.basePort + 1 + portContainer.shift;

    req.on('data', (partOfData) => {
      postData += partOfData;
    });
    req.on('end', () => {
      const options = {
        host: '127.0.0.1',
        port: portTo,
        path: req.url,
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const reqToBase = http.request(options, (resFromBase) => {
        let postDataFromBase = '';

        resFromBase.setEncoding('utf8');
        resFromBase.on('data', (chunk) => {
          postDataFromBase += chunk;
        });
        resFromBase.on('end', () => {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = resFromBase.statusCode ?? 500;
          res.end(postDataFromBase);
        });
      });

      reqToBase.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
      });

      reqToBase.write(postData);
      reqToBase.end();
    });
  };

  if (cluster.isPrimary) {
    let db = cluster.fork({ isDB: 1, wPort: config.PORT - 1 });

    db.on('exit', () => {
      db = cluster.fork({ isDB: 1, wPort: config.PORT - 1 });
    });

    currentWorkerPort.maxShift = os.cpus().length;

    const cores = os.cpus();
    console.log('Master pid: ', `${process.pid}`);
    console.log('Counts workers', cores.length);

    cores.map((_, i) => {
      const workerPort = +config.PORT + i + 1;
      return cluster.fork({ isDB: 0, wPort: workerPort });
    });

    const server = http.createServer(createProxy(currentWorkerPort));

    server.listen(config.PORT);
  } else {
    const isDB = +(process.env.isDB ?? 0);
    const port = +(process.env.wPort ?? config.PORT);

    if (isDB) {
      console.log('i am a db');
      app.listen(port, () => console.log(`DB is running on http://localhost:${port}`));
    } else {
      console.log('worker port', port, ' worker pid:', process.pid);

      const server = http.createServer(createProxy(currentWorkerPort, port));

      server.listen(port);
    }
  }
} else {
  app.listen(config.PORT, () => console.log(`App is running on http://localhost:${config.PORT}`));
}
