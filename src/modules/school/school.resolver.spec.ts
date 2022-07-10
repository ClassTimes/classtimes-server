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
import { SchoolService } from './school.service'
import { SchoolResolver } from './school.resolver'
import { School, SchoolSchema } from './school.model'
import { SubjectService } from '@modules/subject/subject.service'
import { Subject, SubjectSchema } from '@modules/subject/subject.model'
import { InstituteService } from '@modules/institute/institute.service'
import { Institute, InstituteSchema } from '@modules/institute/institute.model'
import { User, UserSchema } from '@modules/user/user.model'
import { UserService } from '@modules/user/user.service'
import { UserResolver } from '@modules/user/user.resolver'
import { Follower, FollowerSchema } from '@modules/follower/follower.model'
import { FollowerService } from '@modules/follower/follower.service'
import { Following, FollowingSchema } from '@modules/following/following.model'
import { FollowingService } from '@modules/following/following.service'
import { MongoStubService } from '@utils/tests/mongo-stub.service'
import { loginTestUser } from '@utils/tests/login-test-user'
import { STUBBED_USER, STUBBED_SCHOOL } from '@utils/tests/record-stubs'
import findSchool from './queries/find-school'
import { EConfiguration } from '@utils/enum'

describe('SchoolResolver', () => {
  let app: INestApplication
  let mongoStub: MongoStubService
  let jwt: string
  let schoolId: string

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
            name: School.name,
            schema: SchoolSchema,
          },
          {
            name: Subject.name,
            schema: SubjectSchema,
          },
          {
            name: Institute.name,
            schema: InstituteSchema,
          },
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
      providers: [
        SchoolService,
        SchoolResolver,
        SubjectService,
        InstituteService,
        UserService,
        UserResolver,
        FollowerService,
        FollowingService,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    // Create a stubbed data
    await mongoStub.createUser(STUBBED_USER)
    schoolId = await mongoStub.createEntity(
      STUBBED_SCHOOL,
      School,
      SchoolSchema,
    )

    // Log in with stubbed user
    jwt = await loginTestUser(STUBBED_USER, moduleRef)

    await app.init()
  })

  afterAll(async () => {
    await mongoStub.close()
    await app.close()
  })

  describe('[QUERY] school', () => {
    it('Should respond with 200 and a JWT for valid credentials', async () => {
      const { body } = await supertest(app.getHttpServer())
        .post('/graphql')
        .send({
          query: findSchool,
          authorization: `Bearer ${jwt}`,
          variables: {
            id: schoolId,
          },
        })
        .expect(200)

      console.log(body)
      // expect(typeof body.data?.loginUser?.jwt).toBe('string')
    })
  })
})
