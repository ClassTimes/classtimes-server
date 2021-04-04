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

  async checkPermissons(
    action: Action,
    id?: mongoose.Types.ObjectId,
  ): Promise<mongoose.Model<mongoose.Document>> {
    // Checks permissons for a single record
    const ability = CaslAbilityFactory.createForUser(this.currentUser)
    if (id) {
      const doc = await this.dbModel.findById(id).exec()
      const model = plainToClass(this.modelClass, doc?.toObject()) as any
      ForbiddenError.from(ability).throwUnlessCan(action, model)
      return doc
    } else {
      ForbiddenError.from(ability).throwUnlessCan(
        action,
        this.modelClass as any,
      )
    }
  }
}
