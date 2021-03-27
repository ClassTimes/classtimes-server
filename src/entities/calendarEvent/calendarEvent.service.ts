import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

// CalendarEvent
import { CalendarEvent, CalendarEventDocument } from './calendarEvent.model'
import {
  CreateCalendarEventInput,
  ListCalendarEventInput,
  UpdateCalendarEventInput,
} from './calendarEvent.inputs'

// Calendar
import { Calendar, CalendarDocument } from '../calendar/calendar.model'

@Injectable()
export class CalendarEventService {
  constructor(
    @InjectModel(CalendarEvent.name)
    private model: Model<CalendarEventDocument>,
    @InjectModel(Calendar.name)
    private calendar: Model<CalendarDocument>,
  ) { }

  async create(payload: CreateCalendarEventInput) {
    const model = new this.model(payload)
    console.log('before', { model, payload })

    await model.save()

    const updateResult = await this.calendar.findByIdAndUpdate(
      model.calendar,
      { $push: { calendarEvents: model._id } },
      { new: true, useFindAndModify: false },
    )

    console.log('[CalendarEventService] [create]', { updateResult })

    return model
  }

  getById(_id: Types.ObjectId) {
    return this.model.findById(_id).exec()
  }

  list(filters: ListCalendarEventInput) {
    return this.model.find({ ...filters }).exec()
  }

  update(payload: UpdateCalendarEventInput) {
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
      const updateResult = await this.calendar.findByIdAndUpdate(
        model.school,
        { $pull: { calendarEvents: _id } },
        // { new: true, useFindAndModify: false },
      )

      console.log('delete updateResult', { updateResult })
    }

    return model
  }
}
