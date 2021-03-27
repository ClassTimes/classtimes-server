import mongoose from 'mongoose'
// import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
// import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
// import * as V from 'class-validator'

import { connectFakeMongo, disconnectFakeMongo } from '../tests/db-handler'
import { Event } from './entities/event.model'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000

describe('Event Model', () => {
  beforeAll(async () => {
    await connectFakeMongo()
  })

  afterAll(async () => {
    await disconnectFakeMongo()
  })

  it('validates using class-validator', async () => {
    expect(Event).toHaveProperty('schema')
    const EventMongoModel = mongoose.model('Event', Event.schema)

    const gastonDocError = new EventMongoModel({
      content: 'gastonmorixe',
    })
    await expect(gastonDocError.save()).rejects.toHaveProperty(
      ['errors', 0, 'constraints', 'contains'],
      'content must contain a Helloooo string',
    )

    // const gastonDocOk = new GastonModel({ username: 'gastonHellomorixe' })
    // expect(gastonDocOk).toHaveProperty('username', 'gastonHellomorixe')
    // await expect(gastonDocOk.save()).resolves.toHaveProperty('_id')
  })
})
