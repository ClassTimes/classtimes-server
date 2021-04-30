import { Schema, Prop } from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import { ObjectType, Field } from '@nestjs/graphql'
import { Document } from 'mongoose'

@ObjectType()
@Schema()
export class VirtualLocation extends Document {
  @Field(() => String)
  @Prop(() => String)
  serviceType: string

  @Field(() => String)
  @Prop(() => String)
  url: string

  @Field(() => String)
  @Prop(() => String)
  notes: string
}
