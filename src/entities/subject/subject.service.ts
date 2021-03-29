import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { Subject, SubjectDocument } from './subject.model'
import { Calendar, CalendarDocument } from '../calendar/calendar.model'
import { School, SchoolDocument } from '../school/school.model'

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
    @InjectModel(Calendar.name)
    private calendar: Model<CalendarDocument>,
    @InjectModel(School.name)
    private school: Model<SchoolDocument>,
  ) { }

  async create(payload: CreateSubjectInput) {
    const model = new this.model(payload)

    await model.save()

    const updateResult = await this.school.findByIdAndUpdate(
      model.school,
      { $push: { subjects: model._id } },
      { new: true, useFindAndModify: false },
    )

    return model
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

  async delete(_id: Types.ObjectId) {
    let model
    try {
      model = await this.model.findByIdAndDelete(_id).exec()
    } catch (error) {
      console.error(error)
      return
    }

    if (model) {
      const updateSchool = await this.school.findByIdAndUpdate(
        model.school,
        { $pull: { subjects: _id } },
        // { new: true, useFindAndModify: false },
      )

      const deleteCalendars = await this.calendar.findByIdAndDelete(model.calendars)
    }

    return { ...model }
  }
}
