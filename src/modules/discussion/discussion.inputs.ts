import { InputType, Field, ID } from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'

import { VirtualLocationInput } from '@entities/virtualLocation/virtualLocation.inputs'
import { CommentInput } from '@modules/comment/comment.inputs'

@InputType()
export class CreateDiscussionInput {
  @Field(() => String, { nullable: false })
  title?: string

  @Field(() => String, { nullable: false })
  content?: string

  @Field(() => ID, { nullable: false })
  subject: mongoose.Types.ObjectId
}

@InputType()
export class ListDiscussionInput extends CreateDiscussionInput {
  @Field(() => ID, { nullable: true })
  _id?: mongoose.Types.ObjectId
}

@InputType()
export class UpdateDiscussionInput extends CreateDiscussionInput {
  @Field(() => ID, { nullable: false })
  _id: mongoose.Types.ObjectId
}
