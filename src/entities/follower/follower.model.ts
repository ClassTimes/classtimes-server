import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'
// import * as V from 'class-validator' // { Prop, Schema, SchemaFactory }

// Pagination
import { withCursor } from '../../utils/Connection'

import * as Utils from '../../utils/Model'
import { School } from '../school/school.model'
import { Subject } from '../subject/subject.model'
import { Institute } from '../institute/institute.model'
import { CalendarEvent } from '../calendarEvent/calendarEvent.model'
import { Event } from '../event/event.model'
import { User } from '../user/user.model'

const Resource = GQL.createUnionType({
  name: 'Resource',
  types: () => [School, Subject, Institute, CalendarEvent, Event, User],
  resolveType(value) {
    switch (value.collection.collectionName) {
      case 'schools':
        return School
      case 'subjects':
        return Subject
      case 'institutes':
        return Institute
      case 'calendarEventss':
        return CalendarEvent
      case 'events':
        return Event
      case 'users':
        return User
      default:
        return null
    }
  },
})

@GQL.ObjectType()
@DB.Schema({
  timestamps: true,
  // autoIndex: true
})
export class Follower extends Utils.BaseModel {
  @GQL.Field(() => GQL.ID)
  _id: mongoose.Types.ObjectId

  @DB.Prop({ required: true })
  resourceId: mongoose.Types.ObjectId

  @GQL.Field(() => Resource, {
    description: 'Resource to be followed (the *followee*)',
  })
  @Utils.Virtual({
    propertyKey: 'resource',
    refPath: 'resourceName',
    localField: 'resourceId',
    foreignField: '_id',
  })
  resource:
    | mongoose.Types.ObjectId
    | User
    | School
    | Subject
    | Institute
    | CalendarEvent
    | Event

  @GQL.Field(() => String)
  @DB.Prop({ required: true })
  resourceName: string

  @DB.Prop({ required: true })
  followerId: mongoose.Types.ObjectId

  @GQL.Field(() => User, {
    description: 'User that follows (current user, the *follower*)',
  })
  @Utils.Virtual({
    propertyKey: 'follower',
    ref: 'User',
    localField: 'followerId',
    foreignField: '_id',
  })
  follower: mongoose.Types.ObjectId | User
}

export type FollowerDocument = Follower & mongoose.Document
export const FollowerSchema = withCursor(Follower.schema)
FollowerSchema.index({ resourceId: 1, followerId: 1 }, { unique: true })
FollowerSchema.plugin(autopopulate)
