import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import { ModuleRef } from '@nestjs/core'
import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'
// import * as V from 'class-validator' // { Prop, Schema, SchemaFactory }

import * as Utils from '../../utils/Model'
import { School, SchoolSchema } from '../school/school.model'
import { Subject } from '../subject/subject.model'
import { Calendar } from '../calendar/calendar.model'
import { CalendarEvent } from '../calendarEvent/calendarEvent.model'
import { Event } from '../event/event.model'
import { User } from '../user/user.model'

const Resource = GQL.createUnionType({
  name: 'Resource',
  types: () => [School, Subject, Calendar, CalendarEvent, Event, User],
  resolveType(value) {
    switch (value.collection.collectionName) {
      case 'schools':
        return School
      case 'subjects':
        return Subject
      case 'calendars':
        return Calendar
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
export class Following extends Utils.BaseModel {
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
  resource: mongoose.Types.ObjectId

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

export type FollowingDocument = Following & mongoose.Document
export const FollowingSchema = Following.schema
FollowingSchema.index({ followerId: 1, resourceId: 1 }, { unique: true })

// FollowingSchema.virtual('resource', {
//   refPath: 'resourceName', // gets 'ref' as doc.resourceName
//   localField: 'resourceId',
//   foreignField: '_id',
//   autopopulate: true,
//   justOne: true,
// })

// FollowingSchema.virtual('follower', {
//   ref: 'User',
//   localField: 'followerId',
//   foreignField: '_id',
//   autopopulate: true,
//   justOne: true,
// })
// FollowingSchema.set('toObject', { virtuals: true })
// FollowingSchema.set('toJSON', { virtuals: true })

FollowingSchema.plugin(autopopulate)
