import { User } from '../resources/users/users.model';

const UserDB: Array<User> = [new User(), new User(), new User()];
// const UserDB: Array<User> = [];

const getAllUsers = (): User[] => UserDB.map((el) => ({ ...el }));

const getUserById = (id: string): User | null => {
  const user: User[] = UserDB.filter((el) => el.id === id);
  return user?.[0] ?? null;
};

const createUser = (user: User): User | null => {
  UserDB.push({ ...user });
  return getUserById(user.id);
};

const updateUser = (user: Partial<User>, id: string) => {
  const currentUser = UserDB.find((x) => x.id === id);
  if (currentUser) {
    currentUser.age = user.age ?? currentUser.age;
    currentUser.username = user.username ?? currentUser.username;
    currentUser.hobbies = user.hobbies ?? currentUser.hobbies;
  }
  return currentUser;
};

const deleteUserById = (id: string) => {
  let pos = null;
  for (let i = 0; i < UserDB.length; i += 1) {
    if (UserDB[i]?.id === id) {
      pos = i;
      break;
    }
  }
  if (pos !== null) {
    return UserDB.splice(pos, 1);
  }
  return null;
};

export const DB = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUserById,
};
