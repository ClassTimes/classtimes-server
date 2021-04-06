import { Injectable, Inject } from '@nestjs/common'
import { CONTEXT } from '@nestjs/graphql'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

// Service
import { BaseService } from '../../utils/BaseService'

// Auth
import { Action } from '../../casl/casl-ability.factory'

// Models
import { School, SchoolDocument } from './school.model'
import { Subject, SubjectDocument } from './school.model'
import { User, UserDocument } from './school.model'

import { WritePermissonsInput } from './permisson.inputs'

@Injectable()
export class PermissonService extends BaseService {
  modelClass: any
  dbModel: any
  context

  constructor(
    // @InjectModel(MODEL_CLASS.name)
    // dbModel: Model<SchoolDocument>,
    @Inject(CONTEXT) context,
  ) {
    super()
    // this.dbModel = dbModel
    this.context = context
  }

  async writePermissons(payload: WritePermissonsInput) {
    // Buscar como inyectar modelo a partir de un string
    await this.checkPermissons(Action.Update, payload._id)
    return this.dbModel
      .findByIdAndUpdate(payload._id, payload, { new: true })
      .exec()
  }
}
