import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'
import * as V from 'class-validator' // { Prop, Schema, SchemaFactory }

import * as Utils from '../../utils/Model'
import { User } from '../user/user.model'
import { CalendarEvent } from '../calendarEvent/calendarEvent.model'

@GQL.ObjectType()
@DB.Schema({
  autoIndex: true,
})
export class Event extends Utils.Model {
  @GQL.Field(() => GQL.ID)
  _id: mongoose.Types.ObjectId

  @GQL.Field(() => String, { nullable: false })
  @DB.Prop({
    required: true,
  })
  @V.MinLength(10)
  content: string

  // Relations
  @GQL.Field(() => CalendarEvent, { nullable: false })
  @DB.Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CalendarEvent',
    required: true,
  })
  calendarEvent: mongoose.Types.ObjectId | CalendarEvent

  @GQL.Field(() => [User], { nullable: true })
  @DB.Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    required: false,
  })
  usersJoining: [mongoose.Types.ObjectId]
}

export type EventDocument = Event & mongoose.Document
export const EventSchema = Event.schema
