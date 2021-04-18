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
    const doc = await this.schoolModel.findById(payload.school).exec()
    const model = plainToClass(School, doc.toObject())
    const record = new Subject(model)
    await this.checkPermissons({
      action: Action.Create,
      record,
    })
    return await this.dbModel.create(payload)
  }

  // getById(_id: Types.ObjectId) {
  //   return this.checkPermissons({ action: Action.Read, resourceId: _id })
  // }

  // TODO: Change to SEARCH
  // list(filters: ListSubjectInput) {
  //   return this.dbModel.find({ ...filters }).exec()
  // }

  // async update(payload: UpdateSubjectInput) {
  //   await this.checkPermissons({
  //     action: Action.Update,
  //     resourceId: payload._id,
  //   })
  //   return this.dbModel
  //     .findByIdAndUpdate(payload._id, payload, { new: true })
  //     .exec()
  // }

  // async delete(_id: Types.ObjectId) {
  //   await this.checkPermissons({ action: Action.Delete, resourceId: _id })
  //   return this.dbModel.findByIdAndDelete(_id).exec()
  // }

  // async deleteMany(_ids: Types.ObjectId[]) {
  //   let model
  //   for (const _id of _ids) {
  //     model = await this.delete(_id)
  //   }
  //   return model
  // }
}
