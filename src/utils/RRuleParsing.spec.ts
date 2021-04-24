import { parseEndDate, MAX_DATE } from './RRuleParsing'

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

      it('should return Thursday 5 weeks from current week if COUNT=9 and INTERVAL=2', () => {
        const rrule =
          'RRULE:FREQ=WEEKLY;COUNT=9;INTERVAL=2;WKST=SU;BYDAY=TU,WE,TH'
        const startDate = new Date('2021-04-20T00:00:00.000Z') // 04/20/2021
        const endDate = new Date('2021-05-20T00:00:00.000Z') // 05/20/2021
        expect(parseEndDate(startDate, rrule).toISOString()).toBe(
          endDate.toISOString(),
        )
      })

      it('should return null if currentDay is not in the specified BYDAY', () => {
        const rrule = 'RRULE:FREQ=WEEKLY;COUNT=12;WKST=SU;BYDAY=TU,WE,TH'
        const startDate = new Date('2021-04-19T00:00:00.000Z') // 04/20/2021
        expect(parseEndDate(startDate, rrule)).toBe(null)
      })
    })

    //
    //

    describe('FREQ=MONTHLY', () => {
      it('should return first friday in 2 months if count=3 and byday=1FR', () => {
        const rrule = 'RRULE:FREQ=MONTHLY;COUNT=3;BYDAY=1FR'
        const startDate = new Date('2021-05-07T00:00:00.000Z') // 05/07/2021
        const endDate = new Date('2021-07-02T00:00:00.000Z') // 07/02/2021
        expect(parseEndDate(startDate, rrule).toISOString()).toBe(
          endDate.toISOString(),
        )
      })
    })
  })
})
