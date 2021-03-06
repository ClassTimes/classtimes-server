import { Field, ID, InputType } from '@nestjs/graphql'
import { Types } from 'mongoose'
@InputType()
export class CreateSubjectInput {
  @Field(() => String, { nullable: false })
  name: string

  @Field(() => String, { nullable: true })
  description?: string

  // Relations
  @Field(() => ID, { nullable: true })
  school?: Types.ObjectId

  @Field(() => ID, { nullable: true })
  institute?: Types.ObjectId

  @Field(() => String, {
    nullable: true,
    description: 'Imagekit link to uploaded image',
  })
  avatarImage?: string
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

  @Field(() => ID, { nullable: true })
  school?: Types.ObjectId

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => String, { nullable: true })
  avatarImage?: string
}
