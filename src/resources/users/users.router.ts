import Router from '../../OrientExpress/Router';
import usersService from './users.service';
import { User } from './users.model';
import { myReq, myRes } from '../../common/types.d';

const usersRouter = new Router();

usersRouter.get('/api/users', async (_: myReq, res: myRes) => {
  // throw new Error();
  const users = await usersService.getAll();
  res.json?.(users, 200);
});

usersRouter.get('/api/users/:id', async (req: myReq, res: myRes) => {
  // throw new Error();
  const id = req.params?.id ?? '';
  User.checkID(id);
  const users = await usersService.getById(id);
  res.json?.(users, 200);
});

usersRouter.post('/api/users', async (req: myReq, res: myRes) => {
  // throw new Error();
  User.checkData(req.body);
  const user = await usersService.create(new User(req.body));
  res.json?.(user, 201);
});

usersRouter.put('/api/users/:id', async (req: myReq, res: myRes) => {
  // throw new Error();
  const id = req.params?.id ?? '';
  User.checkID(id);
  User.checkData(req.body);
  const user = await usersService.update(new User(req.body), id);
  res.json?.(user, 200);
});

usersRouter.delete('/api/users/:id', async (req: myReq, res: myRes) => {
  // throw new Error();
  const id = req.params?.id ?? '';
  User.checkID(id);
  const user = await usersService.deleteById(id);
  res.json?.(user, 204);
});

export default usersRouter;
