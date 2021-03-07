import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Field, ObjectType, ID } from '@nestjs/graphql'
import * as mongoose from 'mongoose'

import { School } from '../school/school.model'
import { Event } from '../event/event.model'

@ObjectType()
@Schema()
export class Calendar {
  @Field(() => ID)
  _id: mongoose.Types.ObjectId

  @Field(() => String)
  @Prop()
  name: string

  @Field(() => School)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'School' })
  school: mongoose.Types.ObjectId | School

  @Field(() => [Event])
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Event' })
  events: mongoose.Types.ObjectId[] | Event[]
}

export type CalendarDocument = Calendar & mongoose.Document
export const CalendarSchema = SchemaFactory.createForClass(Calendar)
