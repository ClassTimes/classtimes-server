import { Field, ID, InputType, ArgsType } from '@nestjs/graphql'
import { Types } from 'mongoose'

@InputType()
export class CreateCareerInput {
  @Field(() => String, { nullable: true })
  name?: string
}

@InputType()
export class ListCareerInput {
  @Field(() => ID, { nullable: true })
  _id?: Types.ObjectId

  // @Field(() => String, { nullable: true })
  // name?: string
}

@InputType()
export class UpdateCareerInput {
  @Field(() => ID)
  _id: Types.ObjectId

  // @Field(() => String, { nullable: true })
  // name?: string

  // @Field(() => String, { nullable: true })
  // shortName?: string
}

@InputType()
export class ApproveCareerInput {
  @Field(() => ID)
  careerId: Types.ObjectId

  @Field(() => ID)
  schoolId: Types.ObjectId
}
