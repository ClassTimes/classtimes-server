import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Field, ObjectType, ID } from '@nestjs/graphql'
import * as mongoose from 'mongoose'
import dayjs from 'dayjs'
// import utc from 'dayjs/plugin/utc'
// // import { RRule } from 'rrule'

// dayjs.extend(utc)

import { Calendar } from '../calendar/calendar.model'

@ObjectType()
@Schema()
export class Event {
  @Field(() => ID)
  _id: mongoose.Types.ObjectId

  @Field(() => String, { nullable: false })
  @Prop({ required: true })
  title: string

  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  description: string

  @Field(() => Date, { nullable: false })
  @Prop({ required: true })
  startDateUtc: Date

  // endDateUtc: Date
  // TODO This should be mandatory. Either explicit duration or end date should be set.
  @Field(() => Date, { nullable: false })
  @Prop({ required: false })
  endDateUtc: Date
  // get endDateUtc(): Date {
  // const startDateUtc = dayjs(this.startDateUtc).utc()
  // if (!this.rrule) {
  //   const endDateUtc = startDateUtc.add(this.durationHours, 'hours')
  //   return endDateUtc.toDate()
  // }
  // const rule = RRule.fromString(
  //   `DTSTART:${startDateUtc.format('YYYYMMDD[T]HHmmss')}Z\nRRULE:${
  //     this.rrule
  //   }`,
  // )
  //   if(rule.count()) // || rule.options.until
  // rule.options.dtstart = start.toDate()
  // const ruleQuery = rule.between(startDateUtc, endDateUtc, false)
  // for (const ruleDate of ruleQuery) {
  //   if (ruleDate.valueOf() === start.valueOf()) {
  //     // skip same event
  //     continue
  //   }
  // }

  @Field(() => Boolean, { nullable: true })
  @Prop({ required: false })
  isAllDay: boolean

  @Field(() => Number, { nullable: false })
  @Prop({ required: false })
  durationHours: number

  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  rrule: string

  @Field(() => [Date], { nullable: true })
  @Prop({ required: false })
  exceptionsDatesUtc: Date[]

  // TODO Person(studend) is Attending a class / not attending? (make friends! and chat)

  // Relations
  @Field(() => Calendar, { nullable: false })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Calendar' })
  calendar: mongoose.Types.ObjectId | Calendar
}

export type EventDocument = Event & mongoose.Document
export const EventSchema = SchemaFactory.createForClass(Event)

//
// # Reference Link
//
// https://github.com/bmoeskau/Extensible/blob/master/recurrence-overview.md
