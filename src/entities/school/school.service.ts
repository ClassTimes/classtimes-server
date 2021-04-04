import { Injectable, Inject } from '@nestjs/common'
import { CONTEXT } from '@nestjs/graphql'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

// Service
import { BaseService } from '../../utils/BaseService'

// Auth
import { Action } from '../../casl/casl-ability.factory'

// School
import { School, SchoolDocument } from './school.model'
import {
  CreateSchoolInput,
  ListSchoolInput,
  UpdateSchoolInput,
} from './school.inputs'

const MODEL_CLASS = School
type TModelDocType = SchoolDocument

@Injectable()
export class SchoolService extends BaseService {
  modelClass = MODEL_CLASS
  dbModel: Model<TModelDocType>
  context: any

  constructor(
    @InjectModel(MODEL_CLASS.name)
    dbModel: Model<TModelDocType>,
    @Inject(CONTEXT) context: any,
  ) {
    super()
    this.dbModel = dbModel
    this.context = context
  }

  async create(payload: CreateSchoolInput) {
    await this.checkPermissons(Action.Create)
    const updatedPayload = {
      createdBy: this.currentUser,
      ...payload,
    }
    const model = new this.dbModel(updatedPayload)
    return model.save()
  }

  getById(_id: Types.ObjectId) {
    return this.checkPermissons(Action.Read, _id)
  }

  async list(filters: ListSchoolInput) {
    const docs = await this.dbModel.find({ ...filters }).exec()
    for (const doc of docs) {
      await this.checkPermissons(Action.Read, doc._id)
    }
    return docs
  }

  async update(payload: UpdateSchoolInput) {
    await this.checkPermissons(Action.Update, payload._id)
    return this.dbModel
      .findByIdAndUpdate(payload._id, payload, { new: true })
      .exec()
  }

  async delete(_id: Types.ObjectId) {
    await this.checkPermissons(Action.Delete, _id)
    return this.dbModel.findByIdAndDelete(_id).exec()
  }
}
