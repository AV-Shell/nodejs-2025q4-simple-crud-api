import { v4 as uuidv4, validate as uuidCheck } from 'uuid';
import { MyCustomError } from '../../common/myCustomError';
import { myAny } from '../../common/types.d';

export interface IUser {
  id: string;
  age: number;
  username: string;
  hobbies: Array<string>;
}

export class User {
  public id: string;
  public age: number;
  public username: string;
  public hobbies: Array<string>;

  constructor({ username = 'USER', age = 0, hobbies = [] }: myAny = {}) {
    this.id = uuidv4();
    this.username = username;
    this.age = age;
    this.hobbies = hobbies;
  }

  static checkData(data: myAny): Partial<IUser> {
    const { username, age, hobbies } = data ?? {};
    if (!username) {
      throw new MyCustomError('"username" is required field', 400);
    }
    if (!username || typeof username !== 'string') {
      throw new MyCustomError('"username" is not valid data. Must be a string', 400);
    }
    if (!age) {
      throw new MyCustomError('"age" is required field', 400);
    }
    if (!age || typeof age !== 'number') {
      throw new MyCustomError('"age" is not valid data. Must be a number', 400);
    }

    if (!hobbies) {
      throw new MyCustomError('"hobbies" is required field', 400);
    }
    if (!hobbies || !Array.isArray(hobbies) || hobbies.some((h) => typeof h !== 'string')) {
      throw new MyCustomError('"hobbies" is not valid data. Must be an array of string', 400);
    }

    return { username, age, hobbies };
  }

  static checkID(id: string) {
    if (!uuidCheck(id)) {
      throw new MyCustomError(`id: "${id}" is not a valid UUID`, 400);
    }
  }
}
