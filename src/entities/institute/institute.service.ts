import { Injectable, Inject } from '@nestjs/common'
import { CONTEXT } from '@nestjs/graphql'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { plainToInstance } from 'class-transformer'

// Service
import { BaseService } from '../../utils/BaseService'

// Auth
import { Action } from '../../casl/casl-ability.factory'

// Institute
import { Institute, InstituteDocument } from './institute.model'
import { CreateInstituteInput } from './institute.inputs'

// School
import { School, SchoolDocument } from '../../entities/school/school.model'

const MODEL_CLASS = Institute
@Injectable()
export class InstituteService extends BaseService<Institute> {
  modelClass = MODEL_CLASS
  dbModel: Model<InstituteDocument>
  context

  constructor(
    @InjectModel(MODEL_CLASS.name)
    dbModel: Model<InstituteDocument>,
    @InjectModel(School.name)
    private schoolModel: Model<SchoolDocument>,
    @Inject(CONTEXT) context,
  ) {
    super()
    this.dbModel = dbModel
    this.context = context
  }

  async create(payload: CreateInstituteInput) {
    const doc = await this.schoolModel.findById(payload.school).exec()
    const model = plainToInstance(School, doc.toObject() as School)
    const record = new Institute(model)
    await this.checkPermissons({
      action: Action.Create,
      record,
    })
    return await this.dbModel.create(payload)
  }
}
