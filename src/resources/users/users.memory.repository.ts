import { MyCustomError } from '../../common/myCustomError';
import { DB } from '../../common/inMemoryDB';
import { IUser } from './users.model';

export const getAll = async () => DB.getAllUsers();

export const getById = async (id: string) => {
  const user = await DB.getUserById(id);
  if (!user) {
    throw new MyCustomError(`The user with id "${id}" was not found`, 404);
  }
  return user;
};

export const create = async (user: IUser) => DB.createUser(user);

export const update = async (userData: Partial<IUser>, id: string) => {
  const user = await DB.updateUser(userData, id);
  if (!user) {
    throw new MyCustomError(`The user with id "${id}" was not found`);
  }
  return user;
};

export const deleteById = async (id: string) => {
  const user = await DB.deleteUserById(id);
  if (!user) {
    throw new MyCustomError(`The user with id "${id}" was not found`);
  }
  return user;
};
