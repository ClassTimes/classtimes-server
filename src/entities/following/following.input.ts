import { Field, ID, InputType } from '@nestjs/graphql'
import { Types } from 'mongoose'

@InputType()
export class CreateFollowingInput {
  @Field(() => ID, { nullable: false })
  resourceId: Types.ObjectId

  @Field(() => String, { nullable: false })
  resourceName: string

  @Field(() => ID, { nullable: false })
  userId: Types.ObjectId
}
