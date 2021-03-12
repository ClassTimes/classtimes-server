import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Field, ObjectType, ID } from '@nestjs/graphql'
import * as mongoose from 'mongoose'
// import dayjs from 'dayjs'
// import utc from 'dayjs/plugin/utc'
// import { RRule } from 'rrule'

// dayjs.extend(utc)

@ObjectType()
@Schema()
export class User {
  @Field(() => ID)
  _id: mongoose.Types.ObjectId

  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  fullName: string

  @Field(() => String, { nullable: false })
  @Prop({ required: true })
  username: string

  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  email: string

  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  mobile: string

  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  role: string

  // Relations
  // @Field(() => Calendar, { nullable: false })
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Calendar' })
  // calendar: mongoose.Types.ObjectId | Calendar
}

export type UserDocument = User & mongoose.Document
export const UserSchema = SchemaFactory.createForClass(User)

//
// # Reference Link
//
// https://github.com/bmoeskau/Extensible/blob/master/recurrence-overview.md
