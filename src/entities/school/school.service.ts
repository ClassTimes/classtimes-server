import { Injectable, Inject } from '@nestjs/common'
import { Args, ID } from '@nestjs/graphql'
import { REQUEST } from '@nestjs/core'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { plainToClass } from 'class-transformer'

// Auth
import { ForbiddenError } from '@casl/ability'
import { CaslAbilityFactory } from '../../casl/casl-ability.factory'
import { CheckPolicies } from '../../casl/policy.guard'
import { Action } from '../../casl/casl-ability.factory'

// User
import { User } from '../user/user.model'

// School
import { School, SchoolDocument } from './school.model'
import {
  CreateSchoolInput,
  ListSchoolInput,
  UpdateSchoolInput,
} from './school.inputs'

@Injectable()
export class SchoolService {
  constructor(
    @InjectModel(School.name)
    private model: Model<SchoolDocument>,
    @Inject(REQUEST) private request: any,
  ) {}

  async checkPermissons(action: Action, _id?: Types.ObjectId) {
    // Checks permissons for a single record
    const currentUser = this.request.req?.user
    const ability = CaslAbilityFactory.createForUser(currentUser)
    if (_id) {
      const doc = await this.model.findById(_id).exec()
      const model = plainToClass(School, doc?.toObject())
      ForbiddenError.from(ability).throwUnlessCan(action, model)
      return doc
    } else {
      ForbiddenError.from(ability).throwUnlessCan(action, School)
      return true // Necessary?
    }
  }

  async create(payload: CreateSchoolInput) {
    await this.checkPermissons(Action.Create)
    const updatedPayload = {
      createdBy: this.request.req.user,
      ...payload,
    }
    const model = new this.model(updatedPayload)
    return model.save()
  }

  getById(_id: Types.ObjectId) {
    return this.checkPermissons(Action.Read, _id)
  }

  list(filters: ListSchoolInput) {
    return this.model.find({ ...filters }).exec()
  }

  async update(payload: UpdateSchoolInput) {
    await this.checkPermissons(Action.Update, payload._id)
    return this.model
      .findByIdAndUpdate(payload._id, payload, { new: true })
      .exec()
  }

  async delete(_id: Types.ObjectId) {
    await this.checkPermissons(Action.Delete, _id)
    let model: any // Model<SchoolDocument>

    try {
      model = await this.model.findByIdAndDelete(_id).exec()
    } catch (error) {
      console.error(error)
      return
    }

    return model
  }
}
