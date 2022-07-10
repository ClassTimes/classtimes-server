import supertest from 'supertest'
import { join } from 'path'
import { Test } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { SendGridModule } from '@anchan828/nest-sendgrid'
import { MongooseModule } from '@nestjs/mongoose'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { INestApplication } from '@nestjs/common'
import { AuthModule } from '@modules/auth/auth.module'
import { UserResolver } from '@modules/user/user.resolver'
import { User, UserSchema } from '@modules/user/user.model'
import { UserService } from '@modules/user/user.service'
import { Follower, FollowerSchema } from '@modules/follower/follower.model'
import { FollowerService } from '@modules/follower/follower.service'
import { Following, FollowingSchema } from '@modules/following/following.model'
import { FollowingService } from '@modules/following/following.service'
import { MongoStubService } from '@utils/tests/mongo-stub.service'
import { STUBBED_USER } from '@utils/tests/record-stubs'
import loginUser from '@modules/auth/queries/login-user'
import { EConfiguration } from '@utils/enum'

describe('AuthResolver', () => {
  let app: INestApplication
  let mongoStub: MongoStubService

  beforeAll(async () => {
    mongoStub = new MongoStubService()
    const { uri } = await mongoStub.init()

    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        SendGridModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (_config: ConfigService) => ({
            apikey: _config.get(EConfiguration.SENDGRID_API_KEY),
          }),
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        }),
        MongooseModule.forRoot(uri),
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
        AuthModule,
      ],
      providers: [UserResolver, UserService, FollowerService, FollowingService],
    }).compile()

    app = moduleRef.createNestApplication()

    // Create a stubbed User
    await mongoStub.createUser(STUBBED_USER)

    await app.init()
  })

  afterAll(async () => {
    await mongoStub.close()
    await app.close()
  })

  describe('[MUTATION] loginUser', () => {
    it('Should respond with 200 and a JWT for valid credentials', async () => {
      const { body } = await supertest(app.getHttpServer())
        .post('/graphql')
        .send({
          operationName: null,
          query: loginUser,
          variables: {
            emailOrUsername: 'test@email.com',
            password: 'supersecret',
          },
        })
        .expect(200)

      expect(typeof body.data?.loginUser?.jwt).toBe('string')
    })

    it('Should respond with 200 throw an error for invalid credentials', async () => {
      const { body } = await supertest(app.getHttpServer())
        .post('/graphql')
        .send({
          operationName: null,
          query: loginUser,
          variables: { emailOrUsername: 'test@email.com', password: 'invalid' },
        })
        .expect(200)

      expect(body.data).toEqual(null)
      // TODO: We can be more specific about the error here
    })

    it('Should respond with 400 for missing payload params', async () => {
      await supertest(app.getHttpServer())
        .post('/graphql')
        .send({
          operationName: null,
          query: loginUser,
          variables: { emailOrUsername: 'test@email.com' },
        })
        .expect(400)
    })
  })
})
