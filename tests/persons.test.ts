import { expect, describe, beforeAll, it } from '@jest/globals';
import dotenv from 'dotenv';
import path from 'path';
import supertest from 'supertest';
import { randomUUID as uuidv4 } from 'node:crypto';

dotenv.config({
  path: path.join(__dirname, './../.env'),
});

const host = process.env.PORT ? `localhost:${process.env.PORT}` : 'localhost:5000';
console.log('HOST', host);
const request = supertest(host);

const usersRoutes = {
  getAll: '/api/users',
  getById: (id: any) => `/api/users/${id}`,
  create: '/api/users',
  update: (id: any) => `/api/users/${id}`,
  delete: (id: any) => `/api/users/${id}`,
};

const TEST_PERSON_DATA = {
  username: 'Maksim',
  age: 29,
  hobbies: ['Writing tests', 'Update old tasks', 'Have fun with Node JS course'],
};

const TEST_PERSON_DATA2 = {
  username: 'Yura',
  age: 38,
  hobbies: ['Create servers', 'Be serious'],
};

describe('Users suite 1', () => {
  let userId: string;
  beforeAll(async () => {
    console.log(`
    "   Mesdames et messieurs,
        nous avons l'honneur ce soir
        de vous présenter la nouvelle collection
        de Rammstein!"`);
    userId = '';
  });

  describe('GET 01', () => {
    it('should get all users', async () => {
      const usersResponse = await request
        .get(usersRoutes.getAll)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/);
      console.log(usersResponse.body);

      expect(usersResponse.status).toEqual(200);
      expect(Array.isArray(usersResponse.body)).toBeTruthy();
    });
  });

  describe('POST 02', () => {
    it('should create a user successfuly', async () => {
      const userResponse = await request
        .post(usersRoutes.create)
        .set('Accept', 'application/json')
        .send(TEST_PERSON_DATA)
        .expect(201)
        .expect('Content-Type', /json/);

      expect(typeof userResponse.body.id).toBe('string');
      expect(userResponse.body.username).toBe(TEST_PERSON_DATA.username);
      expect(userResponse.body.age).toBe(TEST_PERSON_DATA.age);
      expect(userResponse.body.hobbies).toStrictEqual(TEST_PERSON_DATA.hobbies);
      userId = userResponse.body.id;
    });
  });

  describe('GET/${id} 03', () => {
    it('should get a created user successfuly', async () => {
      const userResponse = await request
        .get(usersRoutes.getById(userId))
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(userResponse.body).toBeInstanceOf(Object);
      expect(userResponse.body.id).toBe(userId);
      expect(userResponse.body.username).toBe(TEST_PERSON_DATA.username);
      expect(userResponse.body.age).toBe(TEST_PERSON_DATA.age);
      expect(userResponse.body.hobbies).toStrictEqual(TEST_PERSON_DATA.hobbies);
    });
  });

  describe('PUT/${id} 04', () => {
    it('should update user successfuly', async () => {
      const userResponse = await request
        .put(usersRoutes.update(userId))
        .set('Accept', 'application/json')
        .send(TEST_PERSON_DATA2)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(userResponse.body).toBeInstanceOf(Object);
      expect(userResponse.body.id).toBe(userId);
      expect(userResponse.body.username).toBe(TEST_PERSON_DATA2.username);
      expect(userResponse.body.age).toBe(TEST_PERSON_DATA2.age);
      expect(userResponse.body.hobbies).toStrictEqual(TEST_PERSON_DATA2.hobbies);
    });
  });

  describe('GET/${id} 05', () => {
    it('should get a created user successfuly', async () => {
      const userResponse = await request
        .get(usersRoutes.getById(userId))
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(userResponse.body).toBeInstanceOf(Object);
      expect(userResponse.body.id).toBe(userId);
      expect(userResponse.body.username).toBe(TEST_PERSON_DATA2.username);
      expect(userResponse.body.age).toBe(TEST_PERSON_DATA2.age);
      expect(userResponse.body.hobbies).toStrictEqual(TEST_PERSON_DATA2.hobbies);
    });
  });

  describe('DELETE/${id} 06', () => {
    it('should delete an updated user successfuly', async () => {
      await request
        .delete(usersRoutes.delete(userId))
        .set('Accept', 'application/json')
        .expect(204)
        .expect('Content-Type', /json/);
    });
  });

  describe('GET/${id} 07', () => {
    it('should do not get a deleted user', async () => {
      await request
        .get(usersRoutes.getById(userId))
        .set('Accept', 'application/json')
        .expect(404)
        .expect('Content-Type', /json/);
    });
  });
});

describe('Users suite 2', () => {
  let userIds: { [x: string]: boolean };
  let startUserIds: { [x: string]: boolean };
  let usersLength: number;
  let uuid: string;

  beforeAll(() => {
    console.log(`
    "   Mesdames et messieurs,
        nous avons l'honneur ce soir
        de vous présenter la nouvelle collection
        de Rammstein!"`);

    userIds = {};
    startUserIds = {};
    usersLength = 0;
    uuid = '';
  });

  describe('GET 01', () => {
    it('should get all users', async () => {
      const usersResponse = await request
        .get(usersRoutes.getAll)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/);
      console.log(usersResponse.body);

      expect(usersResponse.status).toEqual(200);
      expect(Array.isArray(usersResponse.body)).toBeTruthy();
      usersLength = usersResponse.body.length;
      startUserIds = usersResponse.body.reduce(
        (acc: { [x: string]: boolean }, user: { id: string | number }) => {
          acc[user.id] = true;
          return acc;
        },
        {},
      );
    });
  });

  describe('POST 02', () => {
    it('should create 10 users successfuly', async () => {
      for (let i = 0; i < 10; i++) {
        const userResponse = await request
          .post(usersRoutes.create)
          .set('Accept', 'application/json')
          .send(TEST_PERSON_DATA)
          .expect(201)
          .expect('Content-Type', /json/);

        expect(typeof userResponse.body.id).toBe('string');
        expect(userResponse.body.username).toBe(TEST_PERSON_DATA.username);
        expect(userResponse.body.age).toBe(TEST_PERSON_DATA.age);
        expect(userResponse.body.hobbies).toStrictEqual(TEST_PERSON_DATA.hobbies);
      }
    });
  });

  describe('GET 03', () => {
    it('should get all users + 10', async () => {
      const usersResponse = await request
        .get(usersRoutes.getAll)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/);
      console.log(usersResponse.body);

      expect(usersResponse.status).toEqual(200);
      expect(Array.isArray(usersResponse.body)).toBeTruthy();
      expect(usersResponse.body.length).toBe(usersLength + 10);
      usersLength = usersResponse.body.length;
      userIds = usersResponse.body.reduce((acc: { [x: string]: boolean }, user: { id: string | number }) => {
        acc[user.id] = true;
        return acc;
      }, {});
    });
  });

  describe('GET/${id} 04', () => {
    it('should do not get a random UUID user ', async () => {
      expect(startUserIds).toBeInstanceOf(Object);
      expect(userIds).toBeInstanceOf(Object);
      do {
        uuid = uuidv4();
      } while (startUserIds[uuid] !== undefined || userIds[uuid] !== undefined);
      await request
        .get(usersRoutes.getById(uuid))
        .set('Accept', 'application/json')
        .expect(404)
        .expect('Content-Type', /json/);
    });
  });

  describe('PUT/${id} 05', () => {
    it('should do not update a random UUID user', async () => {
      await request
        .put(usersRoutes.update(uuid))
        .set('Accept', 'application/json')
        .send(TEST_PERSON_DATA2)
        .expect(404)
        .expect('Content-Type', /json/);
    });
  });

  describe('GET/${id} 06', () => {
    it('should do not get a random UUID user ', async () => {
      await request
        .get(usersRoutes.getById(uuid))
        .set('Accept', 'application/json')
        .expect(404)
        .expect('Content-Type', /json/);
    });
  });

  describe('DELETE/${id} 07', () => {
    it('should do not delete aa random UUID user ', async () => {
      await request
        .delete(usersRoutes.delete(uuid))
        .set('Accept', 'application/json')
        .expect(404)
        .expect('Content-Type', /json/);
    });
  });

  describe('DELETE/${id} 08', () => {
    it('should delete 10 created users', async () => {
      let delArray = Object.keys(userIds).filter((el) => startUserIds?.[el] === undefined);

      for (let i = 0; i < delArray.length; i++) {
        await request
          .delete(usersRoutes.delete(delArray[i]))
          .set('Accept', 'application/json')
          .expect(204)
          .expect('Content-Type', /json/);
      }
    });
  });
});

describe('Users suite 3', () => {
  const invalidUUid = uuidv4().slice(1);
  const invalidUrl = '/users/tratata/agusik/pokakunkal/';

  describe('GET 01', () => {
    it('should do not get users from invalid url', async () => {
      await request.get(invalidUrl).set('Accept', 'application/json').expect(404);
    });
  });

  describe('POST 02', () => {
    it('should do not create user from invalid url', async () => {
      await request.post(invalidUrl).set('Accept', 'application/json').send(TEST_PERSON_DATA).expect(404);
    });
  });

  describe('PUT/${id} 04', () => {
    it('should do not update user from invalid url', async () => {
      await request.put(invalidUrl).set('Accept', 'application/json').send(TEST_PERSON_DATA2).expect(404);
    });
  });

  describe('DELETE/${id} 05', () => {
    it('should do not delete user from invalid url', async () => {
      await request.delete(invalidUrl).set('Accept', 'application/json').expect(404);
    });
  });

  describe('GET/${id} 06', () => {
    it('should do not get user from invalid UUID', async () => {
      await request
        .get(usersRoutes.getById(invalidUUid))
        .set('Accept', 'application/json')
        .expect(400)
        .expect('Content-Type', /json/);
    });
  });

  describe('PUT/${id} 07', () => {
    it('should do not update user from invalid UUID', async () => {
      await request
        .put(usersRoutes.update(invalidUUid))
        .set('Accept', 'application/json')
        .send(TEST_PERSON_DATA2)
        .expect(400)
        .expect('Content-Type', /json/);
    });
  });

  describe('DELETE/${id} 08', () => {
    it('should do not delete user from invalid UUID ', async () => {
      await request
        .delete(usersRoutes.delete(invalidUUid))
        .set('Accept', 'application/json')
        .expect(400)
        .expect('Content-Type', /json/);
    });
  });
});
