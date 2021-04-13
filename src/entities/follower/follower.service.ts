import { Injectable, Inject } from '@nestjs/common'
import { CONTEXT } from '@nestjs/graphql'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

// Auth
// import { Action } from '../../casl/casl-ability.factory'

// Follower
import { Follower, FollowerDocument } from './follower.model'

@Injectable()
export class FollowerService {
  dbModel: Model<FollowerDocument>

  constructor(
    @InjectModel(Follower.name)
    dbModel: Model<FollowerDocument>,
    // @Inject(CONTEXT) context,
  ) {
    // super()
    this.dbModel = dbModel
    // this.context = context
  }

  async create(payload: any) {
    return this.dbModel.create(payload)
  }

  async delete(resourceId: Types.ObjectId, userId: Types.ObjectId | string) {
    return this.dbModel.findOneAndDelete({ userId, resourceId })
  }
}
