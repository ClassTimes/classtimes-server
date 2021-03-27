import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'

// import { School } from '../school/school.model'

@GQL.InputType()
export class CreateEventInput {
  @GQL.Field(() => String, { nullable: false })
  content: string

  // Relations
  @GQL.Field(() => GQL.ID, { nullable: false })
  calendarEvent: mongoose.Types.ObjectId

  @GQL.Field(() => [GQL.ID], { nullable: true })
  usersJoining: [mongoose.Types.ObjectId]
}

@GQL.InputType()
export class ListEventInput extends CreateEventInput {
  @GQL.Field(() => GQL.ID, { nullable: true })
  _id?: mongoose.Types.ObjectId
}

@GQL.InputType()
export class UpdateEventInput extends CreateEventInput {
  @GQL.Field(() => GQL.ID, { nullable: false })
  _id: mongoose.Types.ObjectId

  @GQL.Field(() => String, { nullable: true })
  content: string
}

@GQL.InputType()
export class UserJoinEventInput {
  @GQL.Field(() => GQL.ID, { nullable: false })
  eventId: mongoose.Types.ObjectId

  @GQL.Field(() => GQL.ID, { nullable: false })
  userId: mongoose.Types.ObjectId
}
