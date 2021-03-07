import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Field, ObjectType, ID } from '@nestjs/graphql'
import * as mongoose from 'mongoose'
// import { forwardRef } from '@nestjs/common'

import { Calendar } from '../calendar/calendar.model'

@ObjectType()
@Schema()
export class School {
  @Field(() => ID)
  _id: mongoose.Types.ObjectId

  @Field(() => String)
  @Prop()
  name: string

  @Field(() => [Calendar])
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Calendar' })
  calendars: mongoose.Types.ObjectId[] | Calendar[]
}

export type SchoolDocument = School & mongoose.Document
export const SchoolSchema = SchemaFactory.createForClass(School)
