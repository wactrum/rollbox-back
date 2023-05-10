import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { prepareServer } from "@/main";
import { FastifyAdapter } from "@nestjs/platform-fastify";

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication(new FastifyAdapter());
    app = await prepareServer(app)
    await app.listen(3030, '0.0.0.0');
    await app.getHttpAdapter().getInstance().ready();
  });

  it('/register (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/register')
      .send({email: "test@gmail.com", password: "secret", name: "Test"})
      .set('Accept', 'application/json')

    expect(response.status).toEqual(201);
    console.warn(response)
  });
});
