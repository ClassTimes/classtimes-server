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
import { AuthResolver } from '@modules/auth/auth.resolver'
import { UserResolver } from '@modules/user/user.resolver'
import { User, UserSchema } from '@modules/user/user.model'
import { UserService } from '@modules/user/user.service'
import { Follower, FollowerSchema } from '@modules/follower/follower.model'
import { FollowerService } from '@modules/follower/follower.service'
import { Following, FollowingSchema } from '@modules/following/following.model'
import { FollowingService } from '@modules/following/following.service'
import loginUser from '@modules/auth/queries/login-user'
import { EConfiguration } from '@utils/enum'

describe('AuthResolver', () => {
  let app: INestApplication
  let resolver: AuthResolver

  beforeEach(async () => {
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
        MongooseModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (_config: ConfigService) => ({
            uri:
              _config.get(EConfiguration.MONGODB_URL) ||
              'mongodb://localhost/classtimes',
          }),
        }),
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

    resolver = moduleRef.get<AuthResolver>(AuthResolver)
    app = moduleRef.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('[MUTATION] loginUser', () => {
    it('Should throw an error for invalid credentials', async () => {
      return supertest(app.getHttpServer())
        .post('/graphql')
        .send({ operationName: null, query: loginUser })
        .expect(200)
    })
  })
})
