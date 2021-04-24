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

// Utils
import { BaseService } from '../../utils/BaseService'
import { parseEndDate } from '../../utils/RRuleParsing'

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
    const doc: CalendarDocument = await this.calendarModel
      .findById(payload.calendar)
      .exec()
    const model: Calendar = plainToClass(Calendar, doc.toObject())
    const record: CalendarEvent = new CalendarEvent(model)

    await this.checkPermissons({
      action: Action.Create,
      record,
    })

    /*
     *  If able to create calendarEvent, compute endDate from RRULE
     */

    // const endDateUtc = parseEndDate(payload.startDateUtc, payload.rrule)
    payload.endDateUtc = parseEndDate(payload.startDateUtc, payload.rrule)
    return await this.dbModel.create(payload)
  }

  async listInRange() {
    return null
  }
}
