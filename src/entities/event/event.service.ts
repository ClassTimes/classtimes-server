import { Injectable, Inject } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CONTEXT } from '@nestjs/graphql'
import { Model, Types } from 'mongoose'
import { plainToClass } from 'class-transformer'

// Auth
import { Action } from '../../casl/casl-ability.factory'

// Event
import { Event, EventDocument } from './event.model'
import {
  CreateEventInput,
  ListEventInput,
  UpdateEventInput,
} from './event.inputs'

// Calendar Event
import {
  CalendarEvent,
  CalendarEventDocument,
} from '../calendarEvent/calendarEvent.model'

// Service methods
import { BaseService } from '../../utils/BaseService'
import { CalendarEventService } from '../calendarEvent/calendarEvent.service'

const MODEL_CLASS = Event
@Injectable()
export class EventService extends BaseService {
  modelClass = MODEL_CLASS
  dbModel: Model<EventDocument>
  context

  constructor(
    @InjectModel(Event.name)
    dbModel: Model<EventDocument>,
    @InjectModel(CalendarEvent.name)
    private calendarEventModel: Model<CalendarEventDocument>,
    @Inject(CONTEXT) context,
  ) {
    super()
    this.dbModel = dbModel
    this.context = context
  }

  async create(payload: CreateEventInput) {
    const doc = await this.calendarEventModel
      .findById(payload.calendarEvent)
      .exec()
    const model = plainToClass(CalendarEvent, doc.toObject())
    const record = new Event(model)
    await this.checkPermissons({
      action: Action.Create,
      record,
    })
    return await this.dbModel.create(payload)
  }

  list(filters: ListEventInput) {
    //  return this.model.find({ ...filters }).exec()
  }
}
