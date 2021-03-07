import { Test, TestingModule } from '@nestjs/testing'
import { CalendarResolver } from './calendar.resolver'

describe('CalendarResolver', () => {
  let resolver: CalendarResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalendarResolver],
    }).compile()

    resolver = module.get<CalendarResolver>(CalendarResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
