import { Field, ID, InputType } from '@nestjs/graphql'
import { Types } from 'mongoose'

// import { School } from '../school/school.model'

@InputType()
export class CreateUserInput {
  @Field(() => String, { nullable: true })
  fullName: string

  @Field(() => String, { nullable: false })
  username: string

  @Field(() => String, { nullable: true })
  email: string

  @Field(() => String, { nullable: true })
  mobile: string

  @Field(() => String, { nullable: true })
  role: string

  // Realtions
  // @Field(() => ID)
  // calendar: Types.ObjectId
}

@InputType()
export class ListUserInput {
  @Field(() => ID, { nullable: true })
  _id?: Types.ObjectId

  @Field(() => String, { nullable: true })
  fullName?: string
}

@InputType()
export class UpdateUserInput extends CreateUserInput {
  @Field(() => ID)
  _id: Types.ObjectId
}
