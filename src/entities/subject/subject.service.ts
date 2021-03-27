import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { Subject, SubjectDocument } from './subject.model'
import {
  CreateSubjectInput,
  ListSubjectInput,
  UpdateSubjectInput,
} from './subject.inputs'

@Injectable()
export class SubjectService {
  constructor(
    @InjectModel(Subject.name)
    private model: Model<SubjectDocument>,
  ) { }

  create(payload: CreateSubjectInput) {
    const model = new this.model(payload)
    return model.save()
  }

  getById(_id: Types.ObjectId) {
    return this.model.findById(_id).exec()
  }

  list(filters: ListSubjectInput) {
    return this.model.find({ ...filters }).exec()
  }

  update(payload: UpdateSubjectInput) {
    return this.model
      .findByIdAndUpdate(payload._id, payload, { new: true })
      .exec()
  }

  delete(_id: Types.ObjectId) {
    return this.model.findByIdAndDelete(_id).exec()
  }
}
