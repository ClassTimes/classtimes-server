import { RRule } from 'rrule'
import dayjs from 'dayjs'
import {
  loopIndexForward,
  loopRestarts,
  arrayCompletePasses,
} from './ArrayLooping'

export const MAX_DATE = new Date('3000-01-01T00:00:00.000Z')

export const FREQ = {
  DAILY: 3,
  WEEKLY: 2,
  MONTHLY: 1,
  YEARLY: 0,
}
export const DAYS = {
  MO: 0,
  TU: 1,
  WE: 2,
  TH: 3,
  FR: 4,
  SA: 5,
  SU: 6,
}

export const MONTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

export function parseEndDate(startDateUtc, rruleString): Date {
  const rruleObject = RRule.fromString(rruleString)
  const rrule = rruleObject.options

  if (rrule.until) {
    /*
     * Simply return the endDateUtc stated in the RRule
     */
    // TODO: One might filter by month (BYMONTH)...
    return new Date(rrule.until)
  } else if (rrule.count) {
    /*
     *
     * RRule COUNT
     *
     */
    const count = rrule.count
    const startDate = dayjs(new Date(startDateUtc))

    if (rrule.freq === FREQ.DAILY) {
      const interval = rrule.interval || 1
      return startDate.add((rrule.count - 1) * interval, 'day').toDate()
    }
    //
    //
    //
    else if (rrule.freq === FREQ.WEEKLY) {
      if (rrule.byweekday?.length > 1) {
        /*
         * Check if the provided startDate matches one of the weekdays
         * If not, pick the first coincidence forward
         */
        const weekdays = rrule.byweekday
        const currentDay = startDate.day()
        const startDayIndex = weekdays.indexOf(currentDay)

        if (startDayIndex !== -1) {
          /*
           * Provided startDate *matches* one of the provided weekdays
           */
          if (count <= weekdays.length - startDayIndex) {
            /*
             *  End Date is in the same week as Start Date
             */
            const endDayIndex = startDayIndex + count - 1
            const additionalDays =
              weekdays[endDayIndex] - weekdays[startDayIndex]
            //
            return startDate.add(additionalDays, 'day').toDate()
          } else {
            /*
             *  End Date is not in the same week as Start Date
             */
            const endDayIndex = loopIndexForward(
              weekdays,
              startDayIndex,
              count - 1,
            )
            const additionalDays: number =
              7 - weekdays[startDayIndex] + weekdays[endDayIndex]
            const additionalWeeks: number = arrayCompletePasses(
              weekdays,
              startDayIndex,
              count - 1,
            )
            const interval: number = rrule.interval || 1
            const spanWeeks: number = loopRestarts(
              weekdays,
              startDayIndex,
              count - 1,
            )
            //
            return startDate
              .add(additionalWeeks + spanWeeks * (interval - 1), 'week')
              .add(additionalDays, 'day')
              .toDate()
          }
        } else {
          /*
           * Provided startDate *does not match* one of the provided weekdays
           * Should return an error on save, so return null
           */
          return null
        }
      } else {
        /*
         *  Simple interval + count addition
         */
        const interval = rrule.interval || 1
        return startDate.add((rrule.count - 1) * interval, 'week').toDate()
      }
    }
    //
    //
    //
    else if (rrule.freq === FREQ.MONTHLY) {
      const nweekday = rrule.bynweekday
      if (nweekday) {
        // TODO: Check coincidence with provided nweekday?
        const additionalMonths = loopRestarts(nweekday, 0, count - 1)
      }

      //
      return null
    }
    //
    //
    //
    else if (rrule.freq === FREQ.YEARLY) {
    }
    //
    //
    return MAX_DATE
  } else {
    /*
     * Return endDateUtc far into the future
     */
    return MAX_DATE
  }
}

//

function nthDayInNMonths(startDate, nweekdays, count, interval) {
  const currentMonth = startDate.month()
  const currentYear = startDate.year()
  const startMonthIndex = MONTHS.indexOf(currentMonth)

  const nWeekdayEndIndex = loopIndexForward(nweekdays, 1, count - 1)
  const nWeekdayEnd = nweekdays[nWeekdayEndIndex]
  const nMonths = loopRestarts(nweekdays, 1, count - 1) * interval

  const endMonthIndex = loopIndexForward(MONTHS, startMonthIndex, nMonths)
  const additionalYears = loopRestarts(MONTHS, startMonthIndex, nMonths)

  const endMonth = MONTHS[endMonthIndex]
  const endYear = currentYear + additionalYears

  const endMonthAndYear = dayjs().year(endYear).month(endMonth)

  /*
   * nweekdays is an array of arrays; the inner arrays are of format [a,b]
   * where a is the week day (monday=0, tuesday=1 ...), and b represents if it's the first, second, etc day of the month
   *
   * i.e. [1,1] means first tuesday of the month
   */

  if (nWeekdayEnd[1] > 0) {
    const firstDayOfMonth = endMonthAndYear.day(1)
  } else if (nWeekdayEnd[1] < 0) {
    // January, March, May, August, October, and December have 31 days
    let lastDayOfMonth
    if (
      endMonth === 0 ||
      endMonth === 2 ||
      endMonth === 4 ||
      endMonth === 7 ||
      endMonth === 9 ||
      endMonth === 11
    ) {
      lastDayOfMonth = endMonthAndYear.day(31)
    }
    // April, June, July, September, and November have 30 days
    else if (
      endMonth === 3 ||
      endMonth === 5 ||
      endMonth === 6 ||
      endMonth === 8 ||
      endMonth === 10
    ) {
      lastDayOfMonth = endMonthAndYear.day(30)
    }
    // February may have 29 days during leap years
    else {
    }
  }
  return null
}
