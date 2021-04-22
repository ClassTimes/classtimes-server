import { Injectable, Inject } from '@nestjs/common'
import { CONTEXT } from '@nestjs/graphql'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { plainToClass } from 'class-transformer'

import { Subject, SubjectDocument } from '../subject/subject.model'
import { Calendar, CalendarDocument } from './calendar.model'
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
export class CalendarService extends BaseService<Calendar> {
  modelClass = MODEL_CLASS
  dbModel: Model<CalendarDocument>
  context

  constructor(
    @InjectModel(Calendar.name)
    dbModel: Model<CalendarDocument>,
    @InjectModel(Subject.name)
    private subjectModel: Model<SubjectDocument>,
    @Inject(CONTEXT) context,
  ) {
    super()
    this.dbModel = dbModel
    this.context = context
  }

  async create(payload: CreateCalendarInput) {
    const doc: SubjectDocument = await this.subjectModel
      .findById(payload.subject)
      .exec()
    const model: Subject = plainToClass(Subject, doc.toObject())
    const record: Calendar = new Calendar(model)
    await this.checkPermissons({
      action: Action.Create,
      record,
    })
    return await this.dbModel.create(payload)
  }

  // list(filters: ListCalendarInput) {
  //   //  return this.model.find({ ...filters }).exec()
  // }
}
