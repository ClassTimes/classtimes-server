import { Test, TestingModule } from '@nestjs/testing'
import { SchoolResolver } from './school.resolver'
import { SchoolService } from './school.service'

describe('SchoolResolver', () => {
  let schoolResolver: SchoolResolver
  let schoolService: SchoolService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchoolResolver, SchoolService],
    }).compile()

    schoolResolver = module.get<SchoolResolver>(SchoolResolver)
    schoolService = module.get<SchoolService>(SchoolService)
  })

  // describe('getById', () => {
  //   it('Should return a School', async () => {
  //     const result = {
  //       _id: '1236790412930jdha',
  //       name: 'Test school',
  //     }
  //     jest.spyOn(schoolService, 'getById').mockImplementation(() => result)
  //   })
  // })
})
