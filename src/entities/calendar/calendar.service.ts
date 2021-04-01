import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { Subject, SubjectDocument } from '../subject/subject.model'
import { Calendar, CalendarDocument } from './calendar.model'
import { CalendarEvent, CalendarEventDocument } from '../calendarEvent/calendarEvent.model'
import {
  CreateCalendarInput,
  ListCalendarInput,
  UpdateCalendarInput,
} from './calendar.inputs'

import { CalendarEventService } from '../calendarEvent/calendarEvent.service'

@Injectable()
export class CalendarService {
  constructor(
    @InjectModel(Calendar.name)
    private model: Model<CalendarDocument>,
    @InjectModel(Subject.name)
    private subject: Model<SubjectDocument>,
    @InjectModel(CalendarEvent.name)
    private calendarEvent: Model<CalendarEventDocument>,

    private calendarEventService: CalendarEventService
  ) { }

  async create(payload: CreateCalendarInput) {
    const model = new this.model(payload)
    //console.log('before', { model, payload })

    await model.save()

    const updateResult = await this.subject.findByIdAndUpdate(
      model.subject,
      { $push: { calendars: model._id } },
      { new: true, useFindAndModify: false },
    )
    //console.log('calendar', { updateResult })

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

      const deleteCalendarEvents = await this.calendarEventService.deleteMany(model.calendarEvents)
      //console.log('delete updateResult', { updateResult })
    }

    return model
  }

  async deleteMany(_ids: Types.ObjectId[]) {
    let model
    for (let _id of _ids) {
      model = await this.delete(_id)
    }
    return model
  }
}