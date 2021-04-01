import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveField,
  Parent,
  ID,
} from '@nestjs/graphql'
import { Types } from 'mongoose'

// School
import { Subject, SubjectDocument } from './subject.model'
import { SubjectService } from './subject.service'
import {
  CreateSubjectInput,
  ListSubjectInput,
  UpdateSubjectInput,
} from './subject.inputs'

// Relations models
import { Calendar } from '../calendar/calendar.model'
import { School } from '../school/school.model'


@Resolver(() => Subject)
export class SubjectResolver {
  constructor(private service: SubjectService) { }

  @Query(() => Subject)
  async subject(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.getById(_id)
  }

  @Query(() => [Subject])
  async subjects(
    @Args('filters', { nullable: true }) filters?: ListSubjectInput,
  ) {
    return this.service.list(filters)
  }

  @Mutation(() => Subject)
  async createSubject(@Args('payload') payload: CreateSubjectInput) {
    return this.service.create(payload)
  }

  @Mutation(() => Subject)
  async updateSubject(@Args('payload') payload: UpdateSubjectInput) {
    return this.service.update(payload)
  }

  @Mutation(() => Subject)
  async deleteSubject(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.delete(_id)
  }

  @ResolveField()
  async calendars(
    @Parent() subject: SubjectDocument,
    @Args('populate') populate: boolean,
  ) {
    if (populate) {
      await subject
        .populate({ path: 'calendars', model: Calendar.name })
        .execPopulate()
    }

    return subject.calendars
  }

  @ResolveField()
  async school(
    @Parent() subject: SubjectDocument,
    @Args('populate') populate: boolean,
  ) {
    if (populate) {
      await subject
        .populate({ path: 'school', model: School.name })
        .execPopulate()
    }

    return subject.school
  }
}