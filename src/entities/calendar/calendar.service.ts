import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { Subject, SubjectDocument } from '../subject/subject.model'
import { Calendar, CalendarDocument } from './calendar.model'
import {
  CreateCalendarInput,
  ListCalendarInput,
  UpdateCalendarInput,
} from './calendar.inputs'

@Injectable()
export class CalendarService {
  constructor(
    @InjectModel(Calendar.name)
    private model: Model<CalendarDocument>,
    @InjectModel(Subject.name)
    private subject: Model<SubjectDocument>,
  ) { }

  async create(payload: CreateCalendarInput) {
    const model = new this.model(payload)
    console.log('before', { model, payload })

    await model.save()

    const updateResult = await this.subject.findByIdAndUpdate(
      model.subject,
      { $push: { calendars: model._id } },
      { new: true, useFindAndModify: false },
    )

    console.log('calendar', { updateResult })

    return model
  }

  getById(_id: Types.ObjectId) {
    return this.model.findById(_id).exec()
  }

  list(filters: ListCalendarInput) {
    return this.model.find({ ...filters }).exec()
  }

  update(payload: UpdateCalendarInput) {
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
      const updateResult = await this.subject.findByIdAndUpdate(
        model.subject,
        { $pull: { calendars: _id } },
        // { new: true, useFindAndModify: false },
      )

      console.log('delete updateResult', { updateResult })
    }

    return model
  }
}
