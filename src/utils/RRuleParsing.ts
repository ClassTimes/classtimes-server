import { RRule } from 'rrule'

export const MAX_DATE = new Date('3000-01-01T00:00:00.000Z')

export function parseEndDate(startDateUtc, rruleString): Date {
  const parsedDate = `${
    startDateUtc.toISOString().replace(/-/g, '').replace(/:/g, '').split('.')[0]
  }Z`
  const rruleFullString = `DTSTART:${parsedDate}\nRRULE:${rruleString}`
  const rrule = RRule.fromString(rruleFullString)

  if (!rrule.options.until && !rrule.options.count) {
    // If no COUNT or UNTIL are present, repeat "forever"
    return MAX_DATE
  }

  const allEvents = rrule.all()
  return allEvents[allEvents.length - 1]
}
