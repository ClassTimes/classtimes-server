import supertest from 'supertest'
import { Test, TestingModule } from '@nestjs/testing'
import { SendGridModule } from '@anchan828/nest-sendgrid'
import { MongooseModule } from '@nestjs/mongoose'
import { GraphQLModule } from '@nestjs/graphql'
import { INestApplication } from '@nestjs/common'
import { join } from 'path'

import { User, UserSchema } from './user.model'
import { UserResolver } from './user.resolver'
import { UserService } from './user.service'

import { Follower, FollowerSchema } from '../follower/follower.model'
import { FollowerService } from '../follower/follower.service'

import { Following, FollowingSchema } from '../following/following.model'
import { FollowingService } from '../following/following.service'

// Queries
import { listUsersQuery } from './user.queries'

describe('User', () => {
  let app: INestApplication
  let userService: UserService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        SendGridModule.forRoot({
          apikey: process.env.SENDGRID_API_KEY || 'test_api_key',
        }),
        GraphQLModule.forRoot({
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        }),
        MongooseModule.forRoot(
          process.env.MONGODB || 'mongodb://localhost/classtimes',
        ),
        MongooseModule.forFeature([
          {
            name: User.name,
            schema: UserSchema,
          },
          {
            name: Follower.name,
            schema: FollowerSchema,
          },
          {
            name: Following.name,
            schema: FollowingSchema,
          },
        ]),
      ],
      providers: [UserResolver, UserService, FollowingService, FollowerService],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('POST /graphql listUsers', () => {
    return supertest(app.getHttpServer())
      .post('/graphql')
      .send({ operationName: null, query: listUsersQuery })
      .expect(200)
  })
})
