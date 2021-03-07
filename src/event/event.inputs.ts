import { Field, ID, InputType } from '@nestjs/graphql'
import { Types } from 'mongoose'

// import { School } from '../school/school.model'

@InputType()
export class CreateEventInput {
  @Field(() => String, { nullable: false })
  title: string // Date

  @Field(() => Date, { nullable: false })
  startDateUtc: Date // Date

  @Field(() => Date, { nullable: true })
  endDateUtc: Date // Date

  @Field(() => Boolean, { nullable: true })
  isAllDay: boolean

  @Field(() => Number, { nullable: true })
  durationHours: number

  @Field(() => String, { nullable: true })
  rrule: string

  @Field(() => [Date], { nullable: true })
  exceptionsDatesUtc: Date[]

  // Realtions
  @Field(() => ID)
  calendar: Types.ObjectId
}

@InputType()
export class ListEventInput {
  @Field(() => ID, { nullable: true })
  _id?: Types.ObjectId

  @Field(() => String, { nullable: true })
  title?: string

  @Field(() => ID, { nullable: true })
  calendar: Types.ObjectId
}

@InputType()
export class UpdateEventInput {
  @Field(() => ID)
  _id: Types.ObjectId

  @Field(() => String, { nullable: true })
  title?: string

  // Relations
  @Field(() => ID, { nullable: true })
  calendar: Types.ObjectId
}
