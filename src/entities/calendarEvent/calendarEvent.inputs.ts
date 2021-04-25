import { Field, ID, InputType, ArgsType } from '@nestjs/graphql'
import { Types } from 'mongoose'

// import { School } from '../school/school.model'

@InputType()
export class CreateCalendarEventInput {
  @Field(() => String, { nullable: false })
  title: string

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => Date, { nullable: false })
  startDateUtc: Date

  endDateUtc: Date

  @Field(() => Boolean, { nullable: true })
  isAllDay: boolean

  @Field(() => Number, { nullable: true })
  durationHours: number

  @Field(() => String, { nullable: true })
  rrule: string

  @Field(() => [Date], { nullable: true })
  exceptionsDatesUtc: Date[]

  // Relations
  @Field(() => ID)
  calendar: Types.ObjectId
}

@InputType()
export class ListCalendarEventInput {
  @Field(() => ID, { nullable: true })
  _id?: Types.ObjectId

  @Field(() => String, { nullable: true })
  title?: string

  @Field(() => ID, { nullable: true })
  calendar: Types.ObjectId
}

@InputType()
export class ListCalendarEventsInRangeInput {
  // @Field({ nullable: true })
  // filters?: any // TODO: Add filters to this query

  @Field(() => String, { nullable: false })
  rangeStart: string

  @Field(() => String, { nullable: false })
  rangeEnd: string
}

@InputType()
export class UpdateCalendarEventInput extends CreateCalendarEventInput {
  @Field(() => ID)
  _id: Types.ObjectId

  @Field(() => String, { nullable: true })
  title: string

  @Field(() => Date, { nullable: true })
  startDateUtc: Date

  // Relations
  @Field(() => ID, { nullable: true })
  calendar: Types.ObjectId
}
