import { Injectable, Inject } from '@nestjs/common'
import { CONTEXT } from '@nestjs/graphql'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { plainToClass } from 'class-transformer'

import { Subject, SubjectDocument } from './subject.model'

// Auth
import { Action } from '../../casl/casl-ability.factory'

// Service
import { BaseService } from '../../utils/BaseService'
import { School, SchoolDocument } from '../../entities/school/school.model'

import {
  CreateSubjectInput,
  ListSubjectInput,
  UpdateSubjectInput,
} from './subject.inputs'

const MODEL_CLASS = Subject
@Injectable()
export class SubjectService extends BaseService {
  modelClass = MODEL_CLASS
  dbModel: Model<SubjectDocument>
  context

  constructor(
    @InjectModel(Subject.name)
    dbModel: Model<SubjectDocument>,
    @InjectModel(School.name)
    private schoolModel: Model<SchoolDocument>,
    @Inject(CONTEXT) context,
  ) {
    super()
    this.dbModel = dbModel
    this.context = context
  }

  async create(payload: CreateSubjectInput) {
    const school = await this.schoolModel.findById(payload.school).exec()
    const subject = plainToClass(Subject, payload)
    subject.school = school
    await this.checkPermissons(
      Action.Create,
      undefined,
      undefined,
      undefined,
      subject,
    )
    const model = new this.dbModel(payload)
    await model.save()
    return model
  }

  getById(_id: Types.ObjectId) {
    return this.dbModel.findById(_id).exec()
  }

  list(filters: ListSubjectInput) {
    return this.dbModel.find({ ...filters }).exec()
  }

  update(payload: UpdateSubjectInput) {
    return this.dbModel
      .findByIdAndUpdate(payload._id, payload, { new: true })
      .exec()
  }

  async delete(_id: Types.ObjectId) {
    let model

    try {
      model = await this.dbModel.findByIdAndDelete(_id).exec()
    } catch (error) {
      console.error(error)
      return
    }

    return model
  }

  async deleteMany(_ids: Types.ObjectId[]) {
    let model
    for (const _id of _ids) {
      model = await this.delete(_id)
    }
    return model
  }
}
