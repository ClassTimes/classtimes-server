import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type SchoolDocument = School & Document

@Schema()
export class School {
  @Prop()
  name: string
  //   @Prop()
  //   age: number;
  //   @Prop()
  //   breed: string;
}

export const SchoolSchema = SchemaFactory.createForClass(School)
