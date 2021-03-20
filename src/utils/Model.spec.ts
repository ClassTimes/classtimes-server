import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import * as mongoose from 'mongoose'
import * as V from 'class-validator'

import { connectFakeMongo, disconnectFakeMongo } from '../tests/db-handler'
import { Model, ValidateSchema } from './Model'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000

@GQL.ObjectType()
@DB.Schema({
  validateBeforeSave: true,
  timestamps: true,
  // autoIndex: true,
})
@ValidateSchema()
export class UserFake extends Model {
  @GQL.Field(() => String, { nullable: false })
  @DB.Prop({
    required: true,
    // min: 2,
    // validate(min),
  })
  @V.Contains('Hello')
  username: string
}

describe('Base Model', () => {
  beforeAll(async () => {
    await connectFakeMongo()
  })

  afterAll(async () => {
    await disconnectFakeMongo()
  })

  it('validates using class-validator', async () => {
    expect(UserFake).toHaveProperty('schema')
    const GastonModel = mongoose.model('UserFake', UserFake.schema)

    const gastonDocError = new GastonModel({ username: 'gastonmorixe' })
    await expect(gastonDocError.save()).rejects.toHaveProperty(
      ['extensions', 'failedValidations', 0, 'errorMessage'],
      'username must contain a Hello string',
    )

    const gastonDocOk = new GastonModel({ username: 'gastonHellomorixe' })
    expect(gastonDocOk).toHaveProperty('username', 'gastonHellomorixe')
    await expect(gastonDocOk.save()).resolves.toHaveProperty('_id')
  })
})
