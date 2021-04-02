import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'
// import * as V from 'class-validator' // { Prop, Schema, SchemaFactory }

import * as Utils from '../../utils/Model'
import { Subject } from '../subject/subject.model'
import { User } from '../user/user.model'

//@Utils.HasMany({ field: 'subjects', ref: 'Subject' })
@GQL.ObjectType()
@DB.Schema({
  timestamps: true,
  // autoIndex: true
})
export class School extends Utils.BaseModel {
  @GQL.Field(() => GQL.ID)
  _id: mongoose.Types.ObjectId

  @GQL.Field(() => String)
  @DB.Prop()
  name: string

  // TODO: no es necesario un virtual. El virtual se usa cuando la relacion esta en otro
  // modelo; en este caso, esta guardado en este mismo record (user_id)
  // Lo que no entiendo es por que no me deja popular la query...
  @GQL.Field(() => User, { nullable: false })
  @DB.Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: mongoose.Types.ObjectId | User

  @GQL.Field(() => [Subject], { nullable: true })
  @Utils.OneToMany()
  subjects: mongoose.Types.ObjectId[] | Subject[]
}

export type SchoolDocument = School & mongoose.Document
export const SchoolSchema = School.schema
