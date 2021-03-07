import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Field, ObjectType, ID } from '@nestjs/graphql'
import * as mongoose from 'mongoose'

import { Calendar } from '../calendar/calendar.model'

@ObjectType()
@Schema()
export class Event {
  @Field(() => ID)
  _id: mongoose.Types.ObjectId

  @Field(() => String, { nullable: false })
  @Prop({ required: true })
  title: string // Date

  @Field(() => Date, { nullable: false })
  @Prop({ required: true })
  startDateUtc: Date // Date

  // @Field(() => Date)
  // @Prop({ required: false })
  // endDateUtc: Date // Date

  @Field(() => Boolean, { nullable: true })
  @Prop({ required: false })
  isAllDay: boolean

  @Field(() => Number, { nullable: false })
  @Prop({ required: false })
  durationHours: number

  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  rrule: string

  // Relations
  @Field(() => Calendar, { nullable: false })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Calendar' })
  calendar: mongoose.Types.ObjectId | Calendar
}

export type EventDocument = Event & mongoose.Document
export const EventSchema = SchemaFactory.createForClass(Event)
