import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Field, ObjectType, ID } from '@nestjs/graphql'
import { Document, Types } from 'mongoose'

// import { Hobby } from '../hobby/hobby.model'

@ObjectType()
@Schema()
export class School {
  @Field(() => ID)
  _id: Types.ObjectId

  @Field(() => String)
  @Prop()
  name: string

  // @Field(() => [String])
  // @Prop({ type: [Types.ObjectId], ref: Hobby.name })
  // hobbies: Types.ObjectId[];
}

export type SchoolDocument = School & Document
export const SchoolSchema = SchemaFactory.createForClass(School)
