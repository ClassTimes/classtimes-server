import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'

import { VirtualLocationInput } from '@entities/virtualLocation/virtualLocation.inputs'
import { CommentInput } from '@entities/comment/comment.inputs'
@GQL.InputType()
export class CreateEventInput {
  @GQL.Field(() => String, { nullable: true })
  description?: string

  @GQL.Field(() => String, { nullable: true })
  presentialLocation?: string

  @GQL.Field(() => VirtualLocationInput, { nullable: true })
  virtualLocation?: VirtualLocationInput

  @GQL.Field(() => [CommentInput], { nullable: true })
  comments?: CommentInput[]

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
  description?: string

  @GQL.Field(() => VirtualLocationInput, { nullable: true })
  virtualLocation?: VirtualLocationInput
}

@GQL.InputType()
export class UserJoinEventInput {
  @GQL.Field(() => GQL.ID, { nullable: false })
  eventId: mongoose.Types.ObjectId

  @GQL.Field(() => GQL.ID, { nullable: false })
  userId: mongoose.Types.ObjectId
}
