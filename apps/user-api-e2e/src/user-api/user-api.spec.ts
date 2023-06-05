import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../user-api/src/app/app.module';
import { User } from '../../../user-api/src/app/modules/user/entities/user.entity';
import { generateCreateUserVariables, CREATE_USER_OPERATION_NAME, CREATE_USER_MUTATION } from './helpers/create.user.helper';
import request from 'supertest';
import axios from 'axios';

const GRAPHQL_ENDPOINT = '/graphql';

describe('GET /api', () => {
  it('should return a message', async () => {
    const res = await axios.get(`/api`);

    expect(res.status).toBe(200);;
    expect(res.data).toEqual({ message: 'Hello API' });
  });
})

describe('Users resolver (e2e)', () => {
  let app: INestApplication;
  let user: User;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  afterEach(async () => {
    await app.close();
  });

  it('Should create a user with user mutation', () => {
    const createUserInput = generateCreateUserVariables().createUserInput;
    // return request(app.getHttpServer())
    try {
      const req = request('http://localhost:3000')
        .post(GRAPHQL_ENDPOINT)
        .send({
          operationName: CREATE_USER_OPERATION_NAME,
          query: CREATE_USER_MUTATION,
          variables: { createUserInput },
        })
        .expect(200)
        /*.expect((res) => {
          expect(res.body.data.createUser).toBeDefined();
          user = res.body.data.createUser;
          expect(user.id).toBeDefined();
          expect(user.firstName).toBe(createUserInput.firstName);
          expect(user.lastName).toBe(createUserInput.lastName);
          expect(user.role).toBe(createUserInput.role);
        });*/
      console.log(req);
    } catch (err) {
      console.log(err);
    }
  });
});
