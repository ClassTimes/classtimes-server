import { Test } from '@nestjs/testing'
import { MongooseModule } from '@nestjs/mongoose'
import { INestApplication } from '@nestjs/common'
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
import { baseImports, baseProviders } from '@utils/tests/module-setup'
import { QueryRunner } from '@utils/tests/query-runner'
import findSchool from './queries/find-school'

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
        ...baseImports,
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
      ],
      providers: [
        ...baseProviders,
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
    const findSchoolQuery = new QueryRunner(app, findSchool)

    it('Should respond with 200 and school data when credentials are valid and `id` is correct', async () => {
      const { body } = await findSchoolQuery
        .runQuery({
          variables: { id: schoolId },
          jwt,
        })
        .expect(200)

      const { school } = body.data

      expect(school?._id).toBe(schoolId)
      expect(school?.name).toBe(STUBBED_SCHOOL.name)
      expect(school?.shortName).toBe(STUBBED_SCHOOL.shortName)
    })

    it('Should respond with 200 but without data when `id` is incorrect', async () => {
      const { body } = await findSchoolQuery
        .runQuery({
          // Non-existing ID
          variables: { id: '62cb32b820b3d170a2ce0946' },
          jwt,
        })
        .expect(200)

      // TODO: Better errors?
      expect(body.data).toBe(null)
    })

    it('Should respond with 200 and with "Unauthorized" when missing credentials', async () => {
      const { body } = await findSchoolQuery
        .runQuery({
          variables: { id: schoolId },
        })
        .expect(200)

      expect(body.data).toBe(null)
      expect(body.errors[0].message).toBe('Unauthorized')
    })
  })
})
