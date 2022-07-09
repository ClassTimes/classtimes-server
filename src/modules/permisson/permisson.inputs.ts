import { Field, ID, InputType } from '@nestjs/graphql'
import { Types } from 'mongoose'

@InputType()
export class WritePermissonsInput {
  @Field(() => String)
  resourceName: string

  @Field(() => ID)
  resourceId: Types.ObjectId

  @Field(() => ID)
  subjectId: Types.ObjectId

  @Field(() => String)
  role: string
}
