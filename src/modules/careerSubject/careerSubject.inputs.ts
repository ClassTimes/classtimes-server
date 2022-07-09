import { Field, ID, InputType, Int } from '@nestjs/graphql'
import { Types } from 'mongoose'

@InputType()
export class CreateCareerSubjectInput {
  @Field(() => ID, { nullable: false })
  careerId: Types.ObjectId

  @Field(() => ID, { nullable: false })
  subjectId: Types.ObjectId

  @Field({ nullable: true })
  isMandatory?: boolean

  @Field(() => Int, { nullable: true })
  semester?: number
}
