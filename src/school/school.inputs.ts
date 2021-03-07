import { Field, ID, InputType } from '@nestjs/graphql'
import { Types } from 'mongoose'

@InputType()
export class CreateSchoolInput {
  @Field(() => String)
  name: string
}

@InputType()
export class ListSchoolInput {
  @Field(() => ID, { nullable: true })
  _id?: Types.ObjectId

  @Field(() => String, { nullable: true })
  name?: string
}

@InputType()
export class UpdateSchoolInput {
  @Field(() => ID)
  _id: Types.ObjectId

  @Field(() => String, { nullable: true })
  name?: string
}
