import { Injectable, Inject } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

// Auth
import { CheckPolicies } from '../../casl/policy.guard'
import { Action } from '../../casl/casl-ability.factory'

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

  create(payload: CreateSchoolInput) {
    console.log('[CreateSchool] [User]', this.request.req.user)
    const updatedPayload = {
      createdBy: this.request.req.user,
      ...payload,
    }
    const model = new this.model(updatedPayload)
    return model.save()
  }

  getById(_id: Types.ObjectId) {
    return this.model.findById(_id).exec()
  }

  @CheckPolicies((a) => a.can(Action.List, School))
  list(filters: ListSchoolInput) {
    return this.model.find({ ...filters }).exec()
  }

  update(payload: UpdateSchoolInput) {
    return this.model
      .findByIdAndUpdate(payload._id, payload, { new: true })
      .exec()
  }

  async delete(_id: Types.ObjectId) {
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
