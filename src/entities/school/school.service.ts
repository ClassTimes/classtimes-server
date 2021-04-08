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
@Injectable()
export class SchoolService extends BaseService {
  modelClass = MODEL_CLASS
  dbModel: Model<SchoolDocument>
  context

  constructor(
    @InjectModel(MODEL_CLASS.name)
    dbModel: Model<SchoolDocument>,
    @Inject(CONTEXT) context,
  ) {
    super()
    this.dbModel = dbModel
    this.context = context
  }

  async create(payload: CreateSchoolInput) {
    await this.checkPermissons({ action: Action.Create })
    const updatedPayload = {
      createdBy: this.currentUser,
      ...payload,
    }
    const model = new this.dbModel(updatedPayload)
    return model.save()
  }

  async list(filters: ListSchoolInput) {
    const docs = await this.dbModel.find({ ...filters }).exec()
    for (const doc of docs) {
      await this.checkPermissons({ action: Action.Read, resourceId: doc._id })
    }
    return docs
  }
}
