import {
  arrayCompletePasses,
  loopIndexForward,
  parseEndDate,
  MAX_DATE,
} from './RRuleParsing'

describe('loopIndexForward', () => {
  const testArray = [1, 2, 3, 4, 5, 6]

  it(`Array [${testArray}] should return 2 if startIndex=0 and count=2`, () => {
    expect(loopIndexForward(testArray, 0, 2)).toBe(2)
  })

  it(`Array [${testArray}] should return 3 if startIndex=4 and count=5`, () => {
    expect(loopIndexForward(testArray, 4, 5)).toBe(3)
  })

  it(`Array [${testArray}] should return -1 if startIndex is not an integer`, () => {
    expect(loopIndexForward(testArray, 0.5, 5)).toBe(-1)
  })

  it(`Array [${testArray}] should return -1 if startIndex is negative`, () => {
    expect(loopIndexForward(testArray, -2, 5)).toBe(-1)
  })

  it(`Array [${testArray}] should return -1 if startIndex is greater than length - 1`, () => {
    expect(loopIndexForward(testArray, -2, 5)).toBe(-1)
  })

  it(`Array [${testArray}] should return -1 if count not an integer`, () => {
    expect(loopIndexForward(testArray, 0.5, 5)).toBe(-1)
  })

  it(`Array [${testArray}] should return -1 if count is negative`, () => {
    expect(loopIndexForward(testArray, -2, 5)).toBe(-1)
  })
})

// ------------------------------

describe('arrayCompletePasses', () => {
  const testArray = [1, 2, 3, 4]

  it(`Array [${testArray}] should return 1 with count=10 and startIndex=0`, () => {
    expect(arrayCompletePasses(testArray, 0, 10)).toBe(1)
  })

  it(`Array [${testArray}] should return 0 with count=3 and startIndex=3`, () => {
    expect(arrayCompletePasses(testArray, 3, 3)).toBe(0)
  })

  it(`Array [${testArray}] should return 0 with count=2 and startIndex=0`, () => {
    expect(arrayCompletePasses(testArray, 0, 2)).toBe(0)
  })

  it(`Array [${testArray}] should return -1 if startIndex is not an integer`, () => {
    expect(arrayCompletePasses(testArray, 0.5, 5)).toBe(-1)
  })

  it(`Array [${testArray}] should return -1 if startIndex is negative`, () => {
    expect(arrayCompletePasses(testArray, -2, 5)).toBe(-1)
  })

  it(`Array [${testArray}] should return -1 if startIndex is greater than length - 1`, () => {
    expect(arrayCompletePasses(testArray, -2, 5)).toBe(-1)
  })

  it(`Array [${testArray}] should return -1 if count not an integer`, () => {
    expect(arrayCompletePasses(testArray, 0.5, 5)).toBe(-1)
  })

  it(`Array [${testArray}] should return -1 if count is negative`, () => {
    expect(arrayCompletePasses(testArray, -2, 5)).toBe(-1)
  })
})

// ------------------------------

const startDate = new Date('2021-04-25T00:00:00.000Z') // 04/25/2021

describe('parseEndDate', () => {
  describe('UNTIL', () => {
    it('should return UNTIL date, if specified', () => {
      const rrule = 'RRULE:FREQ=DAILY;UNTIL=20210430T000000Z' // 04/30/2021
      const endDate = new Date('2021-04-30T00:00:00.000Z') // 04/30/2021
      expect(parseEndDate(startDate, rrule).toISOString()).toBe(
        endDate.toISOString(),
      )
    })
  })

  // ----------------------------------------------------------------
  // ----------------------------------------------------------------

  describe('COUNT', () => {
    describe('FREQ=DAILY', () => {
      it('should return MAX_DATE if neither COUNT nor UNTIL are specified', () => {
        const rrule = 'RRULE:FREQ=DAILY'
        expect(parseEndDate(startDate, rrule)).toBe(MAX_DATE)
      })

      it('should return startDate + 9 if COUNT=10', () => {
        const rrule = 'RRULE:FREQ=DAILY;COUNT=10'
        const endDate = new Date('2021-05-04T00:00:00.000Z') // 05/04/2021
        expect(parseEndDate(startDate, rrule).toISOString()).toBe(
          endDate.toISOString(),
        )
      })

      it('should return startDate + 8 if COUNT=5 and INTERVAL=2', () => {
        const rrule = 'RRULE:FREQ=DAILY;COUNT=5;INTERVAL=2'
        const endDate = new Date('2021-05-03T00:00:00.000Z') // 05/03/2021
        expect(parseEndDate(startDate, rrule).toISOString()).toBe(
          endDate.toISOString(),
        )
      })

      it('should return startDate + 6 if COUNT=3 and INTERVAL=3', () => {
        const rrule = 'RRULE:FREQ=DAILY;COUNT=3;INTERVAL=3'
        const endDate = new Date('2021-05-01T00:00:00.000Z') // 05/01/2021
        expect(parseEndDate(startDate, rrule).toISOString()).toBe(
          endDate.toISOString(),
        )
      })
    })

    //
    //

    describe('FREQ=WEEKLY', () => {
      it('should return startDate + 7*(5-1) if COUNT=5', () => {
        const rrule = 'RRULE:FREQ=WEEKLY;COUNT=5'
        const endDate = new Date('2021-05-23T00:00:00.000Z') // 05/23/2021
        expect(parseEndDate(startDate, rrule).toISOString()).toBe(
          endDate.toISOString(),
        )
      })

      it('should return startDate + 2*7*(5-1) if COUNT=5 and INTERVAL=2 ', () => {
        const rrule = 'RRULE:FREQ=WEEKLY;COUNT=5;INTERVAL=2'
        const endDate = new Date('2021-06-20T00:00:00.000Z') // 06/20/2021
        expect(parseEndDate(startDate, rrule).toISOString()).toBe(
          endDate.toISOString(),
        )
      })

      it('should return Sunday of current week if COUNT=3', () => {
        const rrule = 'RRULE:FREQ=WEEKLY;COUNT=3;WKST=SU;BYDAY=TU,TH,SU'
        const startDate = new Date('2021-04-20T00:00:00.000Z') // 04/20/2021
        const endDate = new Date('2021-04-25T00:00:00.000Z') // 04/25/2021
        expect(parseEndDate(startDate, rrule).toISOString()).toBe(
          endDate.toISOString(),
        )
      })

      it('should return Tuesday 2 weeks from current week if COUNT=5', () => {
        const rrule = 'RRULE:FREQ=WEEKLY;COUNT=5;WKST=SU;BYDAY=TU,TH,SU'
        const endDate = new Date('2021-05-04T00:00:00.000Z') // 05/04/2021
        expect(parseEndDate(startDate, rrule).toISOString()).toBe(
          endDate.toISOString(),
        )
      })

      it('should return Thursday 4 weeks from current week if COUNT=12', () => {
        const rrule = 'RRULE:FREQ=WEEKLY;COUNT=12;WKST=SU;BYDAY=TU,WE,TH'
        const startDate = new Date('2021-04-20T00:00:00.000Z') // 04/20/2021
        const endDate = new Date('2021-05-13T00:00:00.000Z') // 05/13/2021
        expect(parseEndDate(startDate, rrule).toISOString()).toBe(
          endDate.toISOString(),
        )
      })
    })
  })
})
