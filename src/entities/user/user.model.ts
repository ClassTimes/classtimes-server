import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import * as V from 'class-validator' // { Prop, Schema, SchemaFactory }
import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'
import { Paginated, withCursor } from '../../utils/Pagination'
import * as Utils from '../../utils/Model'

@GQL.ObjectType()
@DB.Schema({
  timestamps: true,
  // autoIndex: true
})
export class User extends Utils.BaseModel {
  @GQL.Field(() => GQL.ID)
  _id: mongoose.Types.ObjectId

  @GQL.Field(() => String, { nullable: true })
  @DB.Prop({ required: false, min: 3, max: 100 })
  fullName: string

  @GQL.Field(() => String, { nullable: false })
  @DB.Prop({
    required: true,
    lowercase: true,
    unique: true,
    min: 3,
    max: 60,
  })
  username: string

  @GQL.Field(() => String, { nullable: true })
  @DB.Prop({ required: false, unique: true, lowercase: true })
  @V.IsEmail()
  email: string

  @DB.Prop({ required: true })
  passwordHash: string

  @GQL.Field(() => String, { nullable: true })
  @DB.Prop({ required: false, min: 3, max: 60 }) // unique: true,
  mobile: string

  // Counter caches

  @GQL.Field(() => Number)
  @DB.Prop({ type: Number, default: 0 })
  followerCounter: number

  @GQL.Field(() => Number)
  @DB.Prop({ type: Number, default: 0 })
  followingCounter: number
}

export type UserDocument = User & mongoose.Document
export const UserSchema = withCursor(User.schema)
UserSchema.plugin(autopopulate)

@GQL.ObjectType()
export class PaginatedUsers extends Paginated(User) {}

// UserSchema.index({ field1: 1, field2: 1 }, { unique: true })

//
// # Reference Link
//
// https://github.com/bmoeskau/Extensible/blob/master/recurrence-overview.md
