import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

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
  ) { }

  create(payload: CreateSchoolInput) {
    const model = new this.model(payload)
    return model.save()
  }

  getById(_id: Types.ObjectId) {
    return this.model.findById(_id).exec()
  }

  list(filters: ListSchoolInput) {
    return this.model.find({ ...filters }).exec()
  }

  update(payload: UpdateSchoolInput) {
    return this.model
      .findByIdAndUpdate(payload._id, payload, { new: true })
      .exec()
  }

  delete(_id: Types.ObjectId) {
    return this.model.findByIdAndDelete(_id).exec()
  }
}
