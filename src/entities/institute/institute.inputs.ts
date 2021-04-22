import { Field, ID, InputType } from '@nestjs/graphql'
import { Types } from 'mongoose'

@InputType()
export class CreateInstituteInput {
  @Field(() => String)
  name: string

  @Field(() => String, { nullable: true })
  shortName?: string

  // Relations
  @Field(() => ID)
  school?: Types.ObjectId
}

@InputType()
export class ListInstituteInput {
  @Field(() => ID, { nullable: true })
  _id?: Types.ObjectId

  @Field(() => String, { nullable: true })
  name?: string
}

@InputType()
export class UpdateInstituteInput {
  @Field(() => ID)
  _id: Types.ObjectId

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  shortName?: string
}
