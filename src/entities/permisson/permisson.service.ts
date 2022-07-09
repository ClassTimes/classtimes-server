import { Injectable, Inject } from '@nestjs/common'
import { CONTEXT } from '@nestjs/graphql'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { plainToClass } from 'class-transformer'

// Service
import { BaseService } from '@utils/BaseService'

// Auth
import { Action } from '@modules/casl/casl-ability.factory'

// Models
import { School, SchoolDocument } from '@modules/school/school.model'
import { Subject, SubjectDocument } from '@entities/subject/subject.model'
import {
  Institute,
  InstituteDocument,
} from '@entities/institute/institute.model'
import { User, UserDocument } from '@modules/user/user.model'

import { WritePermissonsInput } from './permisson.inputs'

@Injectable()
export class PermissonService extends BaseService<any> {
  modelClass: any
  dbModel: any // Not using it
  context
  dbModels: any
  modelClasses: any

  constructor(
    @InjectModel(School.name)
    school: Model<SchoolDocument>,
    @InjectModel(Subject.name)
    subject: Model<SubjectDocument>,
    @InjectModel(Institute.name)
    institute: Model<InstituteDocument>,
    @InjectModel(User.name)
    user: Model<UserDocument>,
    @Inject(CONTEXT) context,
  ) {
    super()
    this.context = context
    this.dbModels = {
      school,
      subject,
      institute,
      user,
    }
    this.modelClasses = {
      school: School,
      subject: Subject,
      institute: Institute,
      user: User,
    }
  }

  async writePermisson(payload: WritePermissonsInput) {
    // Buscar como inyectar modelo a partir de un string
    const dbModel = this.dbModels[payload.resourceName.toLowerCase()]
    const modelClass = this.modelClasses[payload.resourceName.toLowerCase()]
    await this.checkPermissons({
      action: Action.GrantPermisson,
      resourceId: payload.resourceId,
      modelClass,
      dbModel,
    })
    // Get currentRoles
    const resource = await dbModel.findById(payload.resourceId)
    const model = plainToClass(modelClass, resource?.toObject()) as any

    const roles = model?.roles ?? {}
    roles[payload.role] = roles[payload.role] ?? []
    roles[payload.role].push({ userId: payload.subjectId })

    const updatedModel = await dbModel.findByIdAndUpdate(payload.resourceId, {
      roles,
    })
    return payload
  }
}
