import * as GQL from '@nestjs/graphql' // { Field, ID, InputType }
// import * as V from 'class-validator'
// import { Types } from 'mongoose'
// import { School } from '../school/school.model'

@GQL.InputType()
export class LoginInput {
  // @V.IsEmail()
  @GQL.Field(() => String, { nullable: false })
  emailOrUsername: string

  @GQL.Field(() => String, { nullable: false })
  password: string
}
