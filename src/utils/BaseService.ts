import { Injectable } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { Model, Types, Document } from 'mongoose'

// Pagination
import { ConnectionArgs, getConnection } from '../utils/Connection'

// Auth
import { ForbiddenError } from '@casl/ability'
import { Action } from '@modules/casl/casl-ability.factory'
import { CaslAbilityFactory } from '@modules/casl/casl-ability.factory'

// User
import { User } from '@entities/user/user.model'
@Injectable()
export abstract class BaseService<ResourceModel> {
  abstract dbModel: any // mongoose.Model<mongoose.Document>
  abstract modelClass: any //{ new (): any }
  abstract context: any //{ new (): any }

  get currentUser(): User | undefined {
    return this.context.req?.user
  }

  async checkPermissons(params: {
    action: Action
    resourceId?: Types.ObjectId
    modelClass?: any
    dbModel?: any
    record?: any // Record to be persisted, on create
  }): Promise<Model<Document>> {
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
      ForbiddenError.from(ability).throwUnlessCan(
        action,
        record || (this.modelClass as any),
      )
    }
  }

  async getById(_id: Types.ObjectId): Promise<Model<Document>> {
    return this.checkPermissons({
      action: Action.Read,
      resourceId: _id,
    })
  }

  async update(payload): Promise<Model<Document>> {
    await this.checkPermissons({
      action: Action.Update,
      resourceId: payload._id,
    })
    return this.dbModel
      .findByIdAndUpdate(payload._id, payload, { new: true })
      .exec()
  }

  async delete(_id: Types.ObjectId): Promise<Model<Document>> {
    await this.checkPermissons({ action: Action.Delete, resourceId: _id })
    return this.dbModel.findByIdAndDelete(_id).exec()
  }

  // Follower cache counter ----------

  async increaseFollowingCount(_id: Types.ObjectId): Promise<Model<Document>> {
    return this.dbModel
      .findByIdAndUpdate({ _id }, { $inc: { followerCounter: 1 } })
      .exec()
  }

  async decreaseFollowingCount(_id: Types.ObjectId): Promise<Model<Document>> {
    return this.dbModel
      .findByIdAndUpdate({ _id }, { $inc: { followerCounter: -1 } })
      .exec()
  }

  // Pagination

  async list(filters?: any, connectionArgs?: ConnectionArgs) {
    const { first, after, before } = connectionArgs || {}

    const connection = await getConnection<ResourceModel>({
      dbModel: this.dbModel,
      filters,
      first,
      after,
      before,
    })

    return connection
  }
}
