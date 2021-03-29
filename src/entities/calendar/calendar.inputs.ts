import { Field, ID, InputType } from '@nestjs/graphql'
import { Types } from 'mongoose'

@InputType()
export class CreateCalendarInput {
  @Field(() => String)
  name: string

  @Field(() => ID)
  subject: Types.ObjectId
}

@InputType()
export class ListCalendarInput {
  @Field(() => ID, { nullable: true })
  _id?: Types.ObjectId

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => ID, { nullable: true })
  subject: Types.ObjectId
}

@InputType()
export class UpdateCalendarInput {
  @Field(() => ID)
  _id: Types.ObjectId

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => ID, { nullable: true })
  subject: Types.ObjectId
}
