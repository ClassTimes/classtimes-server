import { Injectable, Inject } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CONTEXT } from '@nestjs/graphql'
import { Model } from 'mongoose'
import { plainToInstance } from 'class-transformer'

// Auth
import { Action } from '../../casl/casl-ability.factory'

// Event
import { Event, EventDocument } from './event.model'
import { CreateEventInput } from './event.inputs'

// Calendar Event
import {
  CalendarEvent,
  CalendarEventDocument,
} from '../calendarEvent/calendarEvent.model'

// Service methods
import { BaseService } from '../../utils/BaseService'

const MODEL_CLASS = Event
@Injectable()
export class EventService extends BaseService<Event> {
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
    const doc: CalendarEventDocument = await this.calendarEventModel
      .findById(payload.calendarEvent)
      .exec()
    const model: CalendarEvent = plainToInstance(
      CalendarEvent,
      doc.toObject() as CalendarEvent,
    )
    const record: Event = new Event(model)
    await this.checkPermissons({
      action: Action.Create,
      record,
    })
    return await this.dbModel.create(payload)
  }
}
