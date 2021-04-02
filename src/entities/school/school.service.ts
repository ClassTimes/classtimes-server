import { Injectable, Inject } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { School, SchoolDocument } from './school.model'
import { Subject, SubjectDocument } from '../subject/subject.model'
import { SubjectService } from '../subject/subject.service'

import { CurrentUser } from '../../auth/currentUser'
import { User } from '../user/user.model'
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
    @Inject(REQUEST) private request: any,

    private subjectService: SubjectService,
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

    return model
  }
}
