import { RRule } from 'rrule'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

export const MAX_DATE = new Date('3000-01-01T00:00:00.000Z')

dayjs.extend(utc)

export function parseEndDate(startDateUtc: Date, rruleString: string): Date {
  const parsedDate: string = dayjs(startDateUtc)
    .utc()
    .format('YYYYMMDD[T]HHmmss')
  const rruleFullString = `DTSTART:${parsedDate}Z\nRRULE:${rruleString}`
  const rrule = RRule.fromString(rruleFullString)

  if (!rrule.options.until && !rrule.options.count) {
    // If no COUNT or UNTIL are present, repeat "forever"
    return MAX_DATE
  }

  const allEvents = rrule.all()
  return allEvents[allEvents.length - 1]
}
