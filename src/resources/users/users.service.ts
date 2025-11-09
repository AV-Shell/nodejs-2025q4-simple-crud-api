import * as usersRepo from './users.memory.repository';
import { IUser } from './users.model';

const getAll = () => usersRepo.getAll();

const getById = (id: string) => usersRepo.getById(id);

const create = (user: IUser) => usersRepo.create(user);

const update = (user: Partial<IUser>, id: string) => usersRepo.update(user, id);

const deleteById = (id: string) => usersRepo.deleteById(id);

export default {
  getAll,
  create,
  getById,
  update,
  deleteById,
};
