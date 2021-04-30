import { Schema, Prop } from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import { ObjectType, Field } from '@nestjs/graphql'
import mongoose from 'mongoose'
import * as Utils from '../../utils/Model'

import { User } from '../user/user.model'
@ObjectType()
@Schema({
  timestamps: true,
})
export class Comment extends Utils.BaseModel {
  @Field(() => String)
  @Prop(() => String)
  content: string

  @Field(() => User, { nullable: false })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true,
  })
  createdBy: mongoose.Types.ObjectId | User
}

export type CommentDocument = Comment & mongoose.Document
export const CommentSchema = Comment.schema
