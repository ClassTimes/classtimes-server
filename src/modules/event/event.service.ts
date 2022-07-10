import { Injectable, Inject } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CONTEXT } from '@nestjs/graphql'
import { Model } from 'mongoose'

// Auth
import { Action } from '@modules/casl/casl-ability.factory'

// Event
import { Event, EventDocument } from './event.model'
import { CreateEventInput } from './event.inputs'

// Calendar Event
import {
  CalendarEvent,
  CalendarEventDocument,
} from '@modules/calendarEvent/calendarEvent.model'

// Service methods
import { BaseService } from '@utils/BaseService'

const MODEL_CLASS = Event
@Injectable()
export class EventService extends BaseService<Event> {
  modelClass = MODEL_CLASS
  dbModel: Model<EventDocument>
  context

  constructor(
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,
    @InjectModel(CalendarEvent.name)
    private calendarEventModel: Model<CalendarEventDocument>,
    @Inject(CONTEXT) context,
  ) {
    super()
    this.dbModel = this.eventModel
    this.context = context
  }

  async create(payload: CreateEventInput) {
    const doc: CalendarEventDocument = await this.calendarEventModel
      .findById(payload.calendarEvent)
      .exec()
    const calendarEvent: CalendarEvent = new this.calendarEventModel(
      doc.toObject(),
    )
    const record: Event = new Event(calendarEvent)
    await this.checkPermissons({
      action: Action.Create,
      record,
    })
    return await this.dbModel.create(payload)
  }
}
