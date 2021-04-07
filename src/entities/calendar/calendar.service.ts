import { Injectable, Inject } from '@nestjs/common'
import { CONTEXT } from '@nestjs/graphql'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { plainToClass } from 'class-transformer'

import { Subject, SubjectDocument } from '../subject/subject.model'
import { Calendar, CalendarDocument } from './calendar.model'
import {
  CalendarEvent,
  CalendarEventDocument,
} from '../calendarEvent/calendarEvent.model'
import {
  CreateCalendarInput,
  ListCalendarInput,
  UpdateCalendarInput,
} from './calendar.inputs'

// Auth
import { Action } from '../../casl/casl-ability.factory'

// Service methods
import { BaseService } from '../../utils/BaseService'
import { CalendarEventService } from '../calendarEvent/calendarEvent.service'

const MODEL_CLASS = Calendar
@Injectable()
export class CalendarService extends BaseService {
  modelClass = MODEL_CLASS
  dbModel: Model<CalendarDocument>
  context

  constructor(
    @InjectModel(Calendar.name)
    dbModel: Model<CalendarDocument>,
    @InjectModel(Subject.name)
    private subjectModel: Model<SubjectDocument>,
    @Inject(CONTEXT) context,

    // private calendarEventService: CalendarEventService,
  ) {
    super()
    this.dbModel = dbModel
    this.context = context
  }

  async create(payload: CreateCalendarInput) {
    const subject = await this.subjectModel.findById(payload.subject).exec()
    const calendar = plainToClass(Calendar, payload)
    calendar.subject = subject
    await this.checkPermissons(
      Action.Create,
      undefined,
      undefined,
      undefined,
      subject,
    )
    const model = new this.dbModel(payload)
    await model.save()
    return model
  }

  getById(_id: Types.ObjectId) {
    //  return this.model.findById(_id).exec()
  }

  list(filters: ListCalendarInput) {
    //  return this.model.find({ ...filters }).exec()
  }

  update(payload: UpdateCalendarInput) {
    // return this.model
    //   .findByIdAndUpdate(payload._id, payload, { new: true })
    //   .exec()
  }

  async delete(_id: Types.ObjectId) {
    // let model
    // try {
    //   model = await this.model.findByIdAndDelete(_id).exec()
    // } catch (error) {
    //   console.error(error)
    //   return
    // }
    // if (model) {
    //   const updateResult = await this.subject.findByIdAndUpdate(
    //     model.subject,
    //     { $pull: { calendars: _id } },
    //     // { new: true, useFindAndModify: false },
    //   )
    //   const deleteCalendarEvents = await this.calendarEventService.deleteMany(
    //     model.calendarEvents,
    //   )
    //   //console.log('delete updateResult', { updateResult })
    // }
    // return model
  }

  // async deleteMany(_ids: Types.ObjectId[]) {
  //   let model
  //   for (let _id of _ids) {
  //     model = await this.delete(_id)
  //   }
  //   return model
  // }
}
