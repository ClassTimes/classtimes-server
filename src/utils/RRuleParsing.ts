import { RRule } from 'rrule'
import dayjs from 'dayjs'

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
    const startDate = dayjs(new Date(startDateUtc))

    if (rrule.freq === FREQ.DAILY) {
      const interval = rrule.interval || 1
      return startDate.add((rrule.count - 1) * interval, 'day').toDate()
    }
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
          if (rrule.count <= weekdays.length - startDayIndex) {
            /*
             *  End Date is in the same week as Start Date
             */
            const endDayIndex = startDayIndex + rrule.count - 1
            const additionalDays =
              weekdays[endDayIndex] - weekdays[startDayIndex]
            //
            return startDate.add(additionalDays, 'day').toDate()
          } else {
            /*
             *  End Date is not in the same week as Start Date
             */
            const count = rrule.count
            const endDayIndex = loopIndexForward(
              weekdays,
              startDayIndex,
              count - 1,
            )
            const additionalDays: number =
              7 - weekdays[startDayIndex] + weekdays[endDayIndex]
            const additionalWeeks: number =
              (count -
                (weekdays.length - startDayIndex - 1) -
                (endDayIndex - 1)) /
                weekdays.length -
              1
            //
            return startDate
              .add(additionalWeeks, 'week')
              .add(additionalDays, 'day')
              .toDate()
          }
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
    else if (rrule.freq === FREQ.MONTHLY) {
    }
    //
    else if (rrule.freq === FREQ.YEARLY) {
    }
    return MAX_DATE
  } else {
    /*
     * Return endDateUtc far into the future
     */
    return MAX_DATE
  }
}

//
//

export const loopIndexForward = (
  arr: Array<number>,
  startIndex: number,
  count: number,
): number => {
  /* startIndex is expected to be:
   *  - An integer
   *  - Greater or equal than 0
   *  - Lower than array length
   */
  if (
    !Number.isInteger(startIndex) ||
    startIndex < 0 ||
    startIndex >= arr.length
  ) {
    return -1
  }

  /* count is expected to be:
   *  - An integer
   *  - Greater or equal than 0
   */

  if (!Number.isInteger(count) || count < 0) {
    return -1
  }

  const endIndex: number = arr.length - 1
  if (count <= endIndex - startIndex) {
    return startIndex + count
  } else {
    /* adjust count to array start */
    const countFromStart = count - (endIndex - startIndex + 1)
    return countFromStart % arr.length
  }
}

// An alternative (tested):

// export const loopIndexForward = (
//   arr: Array<any>,
//   startIndex: number,
//   count: number,
// ): number => {
//   /* Count is expected to be greater than 0 */
//   const endIndex: number = arr.length - 1
//   let loopingIndex: number = startIndex
//   while (count > 0) {
//     if (loopingIndex === endIndex) {
//       loopingIndex = 0
//     } else {
//       loopingIndex++
//     }
//     count--
//   }
//   return loopingIndex
// }

export const arrayCompletePasses = (
  arr: Array<any>,
  startIndex: number,
  count: number,
): number => {
  /*
   * This method counts how many times an array is traversed from start to finish
   * when counting from a [startIndex], a [count] number of times, with a "looping" count
   *
   *
   * For example:
   * [1, 2, 3] [1, 2, 3] [1, 2, 3] [1, 2, 3] [1, 2, 3]
   *     ^  ^   ^  ^  ^   ^  ^  ^   ^  ^  ^   ^  ^
   *     0  1   2  3  4   5  6  7   8  9  10  11 12
   *
   * In this case, count = 12 and startIndex = 1
   * Then the count finished on endIndex = 1, having fully looped through the array 3 times
   *
   * In other words, it counts the number of arrays "in the middle"
   */
  const endIndex = loopIndexForward(arr, startIndex, count)
  if (endIndex === -1) {
    // Invalid arguments
    return -1
  }
  if (count === endIndex - startIndex) {
    // Avoid OBOB-type error
    return 0
  }
  return (count - (arr.length - startIndex - 1) - (endIndex + 1)) / arr.length
}
