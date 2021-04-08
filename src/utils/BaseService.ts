import { Injectable } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import mongoose from 'mongoose'

// Auth
import { ForbiddenError } from '@casl/ability'
import { Action } from '../casl/casl-ability.factory'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'

// User
import { User } from '../entities/user/user.model'

@Injectable()
export abstract class BaseService {
  abstract dbModel: any // mongoose.Model<mongoose.Document>
  abstract modelClass: any //{ new (): any }
  abstract context: any //{ new (): any }

  get currentUser(): User | undefined {
    return this.context.req?.user
  }

  async checkPermissons(params: {
    action: Action
    resourceId?: mongoose.Types.ObjectId
    modelClass?: any
    dbModel?: any
    record?: any // Record to be persisted, on create
  }): Promise<mongoose.Model<mongoose.Document>> {
    const { action, resourceId, modelClass, dbModel, record } = params
    // Checks permissons for a single record
    const ability = CaslAbilityFactory.createForUser(this.currentUser)
    if (resourceId) {
      const doc = await (dbModel || this.dbModel).findById(resourceId).exec()
      const model = plainToClass(
        modelClass || this.modelClass,
        doc?.toObject(),
      ) as any
      ForbiddenError.from(ability).throwUnlessCan(action, record || model)
      return doc
    } else {
      console.log(record.roles)
      ForbiddenError.from(ability).throwUnlessCan(
        action,
        record || (this.modelClass as any),
      )
    }
  }
}
