import { errorHandler, uncaughtExceptionHandler, unhandledRejectionHandler } from './common/errorHandler';
import OrientExpress from './OrientExpress/OrientExpress';
import usersRouter from './resources/users/users.router';

process.on('uncaughtException', uncaughtExceptionHandler);
process.on('unhandledRejection', unhandledRejectionHandler);

const app = new OrientExpress();
app.setErrorHandler(errorHandler);

app.use(OrientExpress.bodyParser);

app.use(usersRouter.middleware);

export default app;
