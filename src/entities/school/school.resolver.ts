import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveField,
  Parent,
  ID,
} from '@nestjs/graphql'
import { Model, Types } from 'mongoose'

// School
import {
  School,
  SchoolDocument,
  PaginatedSchools,
  OffsetPaginatedSchools,
} from './school.model'
import { SchoolService } from './school.service'
import {
  CreateSchoolInput,
  ListSchoolInput,
  UpdateSchoolInput,
} from './school.inputs'
@Resolver(() => School)
export class SchoolResolver {
  constructor(private service: SchoolService) {}

  @Query(() => School)
  async school(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.getById(_id)
  }

  // @Query(() => OffsetPaginatedSchools)
  // async schools(
  //   @Args('filters', { nullable: true }) filters?: ListSchoolInput,
  //   @Args('first', { nullable: true }) first?: number,
  //   @Args('offset', { nullable: true }) offset?: number,
  // ) {
  //   const schools = await this.service.list(filters, first, offset)
  //   return schools
  // }

  @Query(() => PaginatedSchools)
  async schoolsConnection(
    // @Args('filters', { nullable: true }) filters?: ListSchoolInput,
    @Args('first', { nullable: true }) first?: number,
    @Args('after', { nullable: true }) after?: string,
    @Args('before', { nullable: true }) before?: string,
  ) {
    const schools = await this.service.list(first, after, before)
    return schools
  }

  @Mutation(() => School)
  async createSchool(@Args('payload') payload: CreateSchoolInput) {
    return this.service.create(payload)
  }

  @Mutation(() => School)
  async updateSchool(@Args('payload') payload: UpdateSchoolInput) {
    return this.service.update(payload)
  }

  @Mutation(() => School)
  async deleteSchool(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.delete(_id)
  }

  //
  // Field resolvers (deprecated in favor of mongoose-autopopulate)
  //

  /*@ResolveField()
  async subjects(
    @Parent() school: SchoolDocument,
    @Args('populate') populate: boolean,
  ) {
    if (populate) {
      await school
        .populate({ path: 'subjects', model: Subject.name })
        .execPopulate()
    }

    return school.subjects
  }

  @ResolveField('createdBy', () => User)
  async createdBy(
    @Parent() school: SchoolDocument,
    @Args('populate') populate: boolean,
  ) {
    if (populate) {
      console.log(school)
      await school
        .populate({ path: 'createdBy', model: User.name })
        .execPopulate()
    }
    return school.createdBy
  }*/
}
