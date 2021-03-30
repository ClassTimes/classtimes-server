import * as GQL from '@nestjs/graphql'
import * as V from 'class-validator'
import mongoose from 'mongoose'
// import { School } from '../school/school.model'

@GQL.InputType()
export class CreateUserInput {
  @GQL.Field(() => String, { nullable: true })
  fullName: string

  @GQL.Field(() => String, { nullable: false })
  username: string

  @GQL.Field(() => String, { nullable: false })
  @V.MinLength(10)
  password: string

  @GQL.Field(() => String, { nullable: true })
  email: string

  @GQL.Field(() => String, { nullable: true })
  mobile: string

  @GQL.Field(() => String, { nullable: true })
  role: string

  // Realtions
  // @Field(() => ID)
  // calendar: Types.ObjectId
}

@GQL.InputType()
export class ListUserInput {
  @GQL.Field(() => GQL.ID, { nullable: true })
  _id?: mongoose.Types.ObjectId

  @GQL.Field(() => String, { nullable: true })
  fullName?: string
}

@GQL.InputType()
export class UpdateUserInput extends CreateUserInput {
  @GQL.Field(() => GQL.ID)
  _id: mongoose.Types.ObjectId
}
