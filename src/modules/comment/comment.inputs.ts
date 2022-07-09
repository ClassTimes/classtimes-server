import { InputType, Field, ID } from '@nestjs/graphql'
import { Types } from 'mongoose'

@InputType()
export class CommentInput {
  @Field(() => String, { nullable: false })
  content: string

  @Field(() => ID, { nullable: false })
  createdBy: Types.ObjectId
}
