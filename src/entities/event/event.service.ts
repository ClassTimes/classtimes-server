import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

// Event
import { Event, EventDocument } from './event.model'
import {
  CreateEventInput,
  ListEventInput,
  UpdateEventInput,
} from './event.inputs'

// Calendar
// import { Calendar, CalendarDocument } from '../calendar/calendar.model'

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name)
    private model: Model<EventDocument>,
  ) { }
  // @InjectModel(Calendar.name)
  // private calendar: Model<CalendarDocument>,

  async create(payload: CreateEventInput) {
    const model = new this.model(payload)
    // console.log('before', { model, payload })

    await model.save()

    // const updateResult = await this.calendar.findByIdAndUpdate(
    //   model.calendar,
    //   { $push: { events: model._id } },
    //   { new: true, useFindAndModify: false },
    // )

    // console.log('event after', { updateResult })

    return model
  }

  getById(_id: Types.ObjectId) {
    return this.model.findById(_id).exec()
  }

  list(filters: ListEventInput) {
    return this.model.find({ ...filters }).exec()
  }

  update(payload: UpdateEventInput) {
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

    // if (model) {
    //   const updateResult = await this.calendar.findByIdAndUpdate(
    //     model.school,
    //     { $pull: { events: _id } },
    //     // { new: true, useFindAndModify: false },
    //   )

    //   console.log('delete updateResult', { updateResult })
    // }

    return model
  }
}
