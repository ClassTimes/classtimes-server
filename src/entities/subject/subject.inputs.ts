import { Field, ID, InputType } from '@nestjs/graphql'
import { Types } from 'mongoose'

@InputType()
export class CreateSubjectInput {
  @Field(() => String, { nullable: false })
  name: string

  // Relations
  @Field(() => ID)
  school?: Types.ObjectId
}

@InputType()
export class ListSubjectInput {
  @Field(() => ID, { nullable: true })
  _id?: Types.ObjectId

  @Field(() => String, { nullable: true })
  name?: string
}

@InputType()
export class UpdateSubjectInput {
  @Field(() => ID)
  _id: Types.ObjectId

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => ID)
  school?: Types.ObjectId
}
