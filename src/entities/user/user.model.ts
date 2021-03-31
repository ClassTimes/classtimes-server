import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import * as V from 'class-validator' // { Prop, Schema, SchemaFactory }
import mongoose from 'mongoose'

import * as Utils from '../../utils/Model'

@GQL.ObjectType()
@DB.Schema({
  timestamps: true,
  // autoIndex: true
})
@Utils.ValidateSchema()
export class User extends Utils.Model {
  @GQL.Field(() => GQL.ID)
  _id: mongoose.Types.ObjectId

  @GQL.Field(() => String, { nullable: true })
  @DB.Prop({ required: false, min: 3, max: 100 })
  fullName: string
  // @V.Contains('franco')

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
  @DB.Prop({ required: false, unique: true, min: 3, max: 60 })
  mobile: string

  @GQL.Field(() => [String], { nullable: true })
  @DB.Prop({ required: false })
  roles: string[]

  // Relations
  // @GQL.Field(() => Calendar, { nullable: false })
  // @DB.Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Calendar' })
  // calendar: mongoose.Types.ObjectId | Calendar
}

export type UserDocument = User & mongoose.Document
export const UserSchema = User.schema
// UserSchema.index({ field1: 1, field2: 1 }, { unique: true })

//
// # Reference Link
//
// https://github.com/bmoeskau/Extensible/blob/master/recurrence-overview.md
