import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { School, SchoolDocument } from './school.model'
import { Subject, SubjectDocument } from '../subject/subject.model'
import { SubjectService } from '../subject/subject.service'

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
    @InjectModel(Subject.name)
    private subject: Model<SubjectDocument>,

    private subjectService: SubjectService
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

  async delete(_id: Types.ObjectId) {
    let model: any // Model<SchoolDocument>

    try {
      model = await this.model.findByIdAndDelete(_id).exec()
    } catch (error) {
      console.error(error)
      return
    }

    if (model) {
      const deleteSubject = await this.subjectService.deleteMany(model.subjects)
      //const updateResult = await this.subject.findByIdAndDelete(model.subjects);
      //console.log('delete updateResult', { updateResult })
    }

    return model;
  }
}
