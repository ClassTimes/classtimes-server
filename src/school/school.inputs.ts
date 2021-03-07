import { Field, ID, InputType } from '@nestjs/graphql'
import { Types } from 'mongoose'

// import { Hobby } from '../hobby/hobby.model';
@InputType()
export class CreateSchoolInput {
  @Field(() => String)
  name: string
  //   hobbies: Hobby[];
}

@InputType()
export class ListSchoolInput {
  @Field(() => ID, { nullable: true })
  _id?: Types.ObjectId

  @Field(() => String, { nullable: true })
  name?: string

  //   hobbies?: Hobby[];
}

@InputType()
export class UpdateSchoolInput {
  @Field(() => ID)
  _id: Types.ObjectId

  @Field(() => String, { nullable: true })
  name?: string

  // hobbies?: Types.ObjectId[];
}
