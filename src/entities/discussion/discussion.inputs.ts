import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'

import { VirtualLocationInput } from '../virtualLocation/virtualLocation.inputs'
import { CommentInput } from '../comment/comment.inputs'
@GQL.InputType()
export class CreateDiscussionInput {
  @GQL.Field(() => String, { nullable: false })
  title?: string

  @GQL.Field(() => String, { nullable: false })
  content?: string

  @GQL.Field(() => GQL.ID, { nullable: false })
  subject: mongoose.Types.ObjectId
}

@GQL.InputType()
export class ListDiscussionInput extends CreateDiscussionInput {
  @GQL.Field(() => GQL.ID, { nullable: true })
  _id?: mongoose.Types.ObjectId
}

@GQL.InputType()
export class UpdateDiscussionInput extends CreateDiscussionInput {
  @GQL.Field(() => GQL.ID, { nullable: false })
  _id: mongoose.Types.ObjectId
}
