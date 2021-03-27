import { Test, TestingModule } from '@nestjs/testing'

import { CalendarEventResolver } from './entities/calendarEvent.resolver'

describe('CalendarEventResolver', () => {
  let resolver: CalendarEventResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalendarEventResolver],
    }).compile()

    resolver = module.get<CalendarEventResolver>(CalendarEventResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
