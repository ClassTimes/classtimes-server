import { Injectable, Inject } from '@nestjs/common'
import { CONTEXT } from '@nestjs/graphql'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { plainToClass } from 'class-transformer'

// CalendarEvent
import { CalendarEvent, CalendarEventDocument } from './calendarEvent.model'
import {
  CreateCalendarEventInput,
  ListCalendarEventInput,
  UpdateCalendarEventInput,
} from './calendarEvent.inputs'

// Calendar
import { Calendar, CalendarDocument } from '../calendar/calendar.model'

// Auth
import { Action } from '../../casl/casl-ability.factory'

// Service methods
import { BaseService } from '../../utils/BaseService'

const MODEL_CLASS = CalendarEvent
@Injectable()
export class CalendarEventService extends BaseService<CalendarEvent> {
  modelClass = MODEL_CLASS
  dbModel: Model<CalendarEventDocument>
  context

  constructor(
    @InjectModel(CalendarEvent.name)
    dbModel: Model<CalendarEventDocument>,
    @InjectModel(Calendar.name)
    private calendarModel: Model<CalendarDocument>,
    @Inject(CONTEXT) context,

    // private calendarEventService: CalendarEventService,
  ) {
    super()
    this.dbModel = dbModel
    this.context = context
  }

  async create(payload: CreateCalendarEventInput) {
    const doc = await this.calendarModel.findById(payload.calendar).exec()
    const model = plainToClass(Calendar, doc.toObject())
    const record = new CalendarEvent(model)
    await this.checkPermissons({
      action: Action.Create,
      record,
    })
    return await this.dbModel.create(payload)
  }

  // getById(_id: Types.ObjectId) {
  //   return this.model.findById(_id).exec()
  // }

  // list(filters: ListCalendarEventInput) {
  //   return this.dbModel.find({ ...filters }).exec()
  // }

  // update(payload: UpdateCalendarEventInput) {
  //   return this.model
  //     .findByIdAndUpdate(payload._id, payload, { new: true })
  //     .exec()
  // }

  // async delete(_id: Types.ObjectId) {
  //   let model
  //   try {
  //     model = await this.model.findByIdAndDelete(_id).exec()
  //   } catch (error) {
  //     console.error(error)
  //     return
  //   }

  //   if (model) {
  //     const updateResult = await this.calendar.findByIdAndUpdate(
  //       model.school,
  //       { $pull: { calendarEvents: _id } },
  //       // { new: true, useFindAndModify: false },
  //     )

  //     console.log('delete updateResult', { updateResult })
  //   }

  //   return model
  // }

  // async deleteMany(_ids: Types.ObjectId[]) {
  //   let model
  //   for (let _id of _ids) {
  //     model = await this.delete(_id)
  //   }
  //   return model
  // }
}
