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
import { plainToClass } from 'class-transformer'

// Auth
import { ForbiddenError } from '@casl/ability'
import { CheckPolicies } from '../../casl/policy.guard'
import { Action } from '../../casl/casl-ability.factory'
import { CaslAbilityFactory } from '../../casl/casl-ability.factory'
import { CurrentUser } from '../../auth/currentUser'

// School
import { School, SchoolDocument } from './school.model'
import { SchoolService } from './school.service'
import {
  CreateSchoolInput,
  ListSchoolInput,
  UpdateSchoolInput,
} from './school.inputs'

// Subject
import { Subject } from '../subject/subject.model'

// User
import { User } from '../user/user.model'

@Resolver(() => School)
export class SchoolResolver {
  constructor(private service: SchoolService) {}

  @ResolveField('createdBy', () => User)
  @CheckPolicies((a) => a.can(Action.List, User))
  async createBy(
    @Parent() school: SchoolDocument,
    @Args('populate') populate: boolean,
  ) {
    if (populate) {
      await school
        .populate({ path: 'createdBy', model: User.name })
        .execPopulate()
    }
    return school.createdBy
  }

  @Query(() => School)
  @CheckPolicies((a) => true)
  async school(
    @Args('_id', { type: () => ID }) _id: Types.ObjectId,
    @CurrentUser() currentUser?: User,
  ) {
    const doc = await this.service.getById(_id)
    const modelData = doc.toObject()
    // this.service.model.modelName === 'School'
    const model = plainToClass(School, modelData)

    console.log('doc', doc)
    console.log('modelData', modelData)
    console.log('model', model)

    const ability = CaslAbilityFactory.createForUser(currentUser)
    ForbiddenError.from(ability).throwUnlessCan(Action.Read, model)
    return model
  }

  // @CheckPolicies((a) => {
  //   //
  //   // Policies
  //   //    user:gaston -> [ 'subject/school:id/100:action/update' ]
  //   // 1. dame toda los persmisos del current User
  //   // 2. agarra el id (si lo hay) del input {_id: 100 }
  //   // 3. fijate los permisos que tiene para el school con id estan
  //   // 4. fake object school = new School({ createBy: currentUser })

  //   // or
  //   // 1. fake object school = new School({ id })
  //   //

  //   // 1. Pedir a la DB el modelo
  //   // 2. check permissions
  //   // a.can(Action.List, school)
  //   return new Promise((resolve) => {
  //     console.log('test1')
  //     setTimeout(() => {
  //       console.log('test1')
  //       resolve(true)
  //     }, 5000)
  //   })
  // }) //  {schoolId: '23424'}
  @Query(() => [School])
  @CheckPolicies((a) => true)
  async schools(
    @Args('filters', { nullable: true }) filters?: ListSchoolInput,
    @CurrentUser() currentUser?: User,
  ) {
    const ability = CaslAbilityFactory.createForUser(currentUser)
    ForbiddenError.from(ability).throwUnlessCan(Action.List, School)
    return this.service.list(filters)
  }

  @Mutation(() => School)
  @CheckPolicies((a) => true)
  async createSchool(@Args('payload') payload: CreateSchoolInput) {
    return this.service.create(payload)
  }

  @Mutation(() => School)
  @CheckPolicies((a) => a.can(Action.Update, School))
  async updateSchool(@Args('payload') payload: UpdateSchoolInput) {
    return this.service.update(payload)
  }

  @Mutation(() => School)
  @CheckPolicies((a) => a.can(Action.Delete, School)) // Obviously not working
  async deleteSchool(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.delete(_id)
  }

  @ResolveField()
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
}
