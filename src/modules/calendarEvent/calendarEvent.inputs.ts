import { Field, ID, InputType, ArgsType } from '@nestjs/graphql'
import { Types } from 'mongoose'

import { VirtualLocationInput } from '@entities/virtualLocation/virtualLocation.inputs'
// https://docs.nestjs.com/graphql/scalars

@InputType()
export class CreateCalendarEventInput {
  @Field(() => String, { nullable: false })
  title: string

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => String, { nullable: true })
  presentialLocation?: string

  @Field(() => VirtualLocationInput, { nullable: true })
  virtualLocation?: VirtualLocationInput

  @Field(() => Date, { nullable: false })
  startDateUtc: Date

  /* This needs to be here for create() to work */
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
  subject: Types.ObjectId

  @Field(() => ID, { nullable: true })
  basedOnCalendarEvent: Types.ObjectId
}

@InputType()
export class ListCalendarEventsInput {
  @Field(() => ID, { nullable: true })
  subject?: Types.ObjectId

  @Field(() => Date, { nullable: true })
  rangeStart?: Date

  @Field(() => Date, { nullable: true })
  rangeEnd?: Date
}

@InputType()
export class UpdateCalendarEventInput extends CreateCalendarEventInput {
  @Field(() => ID)
  _id: Types.ObjectId
}
