import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'
import * as Utils from '../../utils/Model'
import * as V from 'class-validator' // { Prop, Schema, SchemaFactory }

// Pagination
import { Connected, ConnectionType, withCursor } from '../../utils/Connection'

// Entities
import { Event } from '../event/event.model'

@GQL.ObjectType()
@DB.Schema({
  autoIndex: true,
})
export class Comment extends Utils.BaseModel {
  constructor(resource: Event) {
    super()
    this.resource = resource
  }

  @GQL.Field(() => GQL.ID)
  _id: mongoose.Types.ObjectId

  @GQL.Field(() => String, { nullable: false })
  content: string

  @GQL.Field(() => String, { nullable: false })
  resourceName: string

  @DB.Prop({ required: true })
  resourceId: mongoose.Types.ObjectId

  @GQL.Field(() => Event, {
    description: 'Resource to which the comment belongs to',
  })
  @Utils.Virtual({
    propertyKey: 'resource',
    refPath: 'resourceName',
    localField: 'resourceId',
    foreignField: '_id',
  })
  resource: mongoose.Types.ObjectId | Event

  /*
   *  Relations
   */
}

export type CommentDocument = Comment & mongoose.Document
export const CommentSchema = withCursor(Comment.schema)
CommentSchema.plugin(autopopulate)

@GQL.ObjectType()
export class ConnectedComments extends Connected(Comment) {}
