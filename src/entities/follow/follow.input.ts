import { Field, ID, InputType } from '@nestjs/graphql'
import { Types } from 'mongoose'

@InputType()
export class CreateFollowInput {
  @Field(() => ID, { nullable: false })
  resourceId: Types.ObjectId

  @Field(() => ID, { nullable: false })
  userId: Types.ObjectId
}

@InputType()
export class DeleteFollowInput {
  @Field(() => ID, { nullable: true })
  resourceId: Types.ObjectId

  @Field(() => ID, { nullable: true })
  userId: Types.ObjectId
}
