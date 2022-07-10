import supertest from 'supertest'
import { join } from 'path'
import { Test } from '@nestjs/testing'
import { SendGridModule } from '@anchan828/nest-sendgrid'
import { MongooseModule } from '@nestjs/mongoose'
import { GraphQLModule } from '@nestjs/graphql'
import { INestApplication } from '@nestjs/common'
import { AuthModule } from '@modules/auth/auth.module'
import { AuthResolver } from '@modules/auth/auth.resolver'
import { UserResolver } from '@modules/user/user.resolver'
import { User, UserSchema } from '@modules/user/user.model'
import { UserService } from '@modules/user/user.service'
import loginUser from '@modules/auth/queries/login-user'

describe('AuthResolver', () => {
  let app: INestApplication
  let resolver: AuthResolver

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
        ]),
        AuthModule,
      ],
      providers: [UserResolver, UserService],
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
