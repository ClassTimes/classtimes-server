import { Injectable, Inject, OnModuleInit } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { CONTEXT } from '@nestjs/graphql'
import { getModelToken, InjectModel } from '@nestjs/mongoose'
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
  // implements OnModuleInit
  modelClass = MODEL_CLASS
  dbModel: Model<SchoolDocument>
  context

  constructor(
    @InjectModel(MODEL_CLASS.name)
    dbModel: Model<SchoolDocument>,
    private moduleRef: ModuleRef,
    @Inject(CONTEXT) context,
  ) {
    super()
    // const test = InjectModel(MODEL_CLASS.name)
    this.dbModel = dbModel
    // console.log('test', test)
    this.context = context
  }

  // onModuleInit() {
  //   const test = this.moduleRef.get(getModelToken('School'))
  //   console.log('test', test)
  // }

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
    const test = this.moduleRef.get(getModelToken(MODEL_CLASS.name), {
      strict: false,
    })
    console.log('test', test)

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
