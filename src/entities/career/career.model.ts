import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'
import * as Utils from '../../utils/Model'

// Pagination
import { Paginated, PaginatedType, withCursor } from '../../utils/Pagination'

// Entities
import { User } from '../user/user.model'
import { Subject, PaginatedSubjects } from '../subject/subject.model'
import { School } from '../school/school.model'

@GQL.ObjectType()
@DB.Schema({
  timestamps: true,
  // autoIndex: true
})
export class Career extends Utils.BaseModel {
  @GQL.Field(() => GQL.ID)
  _id: mongoose.Types.ObjectId

  @GQL.Field(() => String)
  @DB.Prop()
  name: string

  @GQL.Field(() => User, { nullable: false })
  @DB.Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true,
  })
  createdBy: mongoose.Types.ObjectId | User

  /*
   *  Relations
   */

  @GQL.Field(() => School, { nullable: true })
  @DB.Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    autopopulate: true,
  })
  approvingSchool: mongoose.Types.ObjectId | School

  /*
   *  Connections
   */

  @GQL.Field(() => PaginatedSubjects, { nullable: true })
  subjectsConnection: PaginatedType<Subject>
}

export type CareerDocument = Career & mongoose.Document
export const CareerSchema = withCursor(Career.schema)
CareerSchema.plugin(autopopulate)
@GQL.ObjectType()
export class PaginatedCareers extends Paginated(Career) {}
