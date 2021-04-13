import { Injectable, Inject } from '@nestjs/common'
import { CONTEXT } from '@nestjs/graphql'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

// Auth
// import { Action } from '../../casl/casl-ability.factory'

// Following
import { Following, FollowingDocument } from './following.model'
// import {
//   CreateSchoolInput,
//   ListSchoolInput,
//   UpdateSchoolInput,
// } from './school.inputs'

@Injectable()
export class FollowingService {
  dbModel: Model<FollowingDocument>

  constructor(
    @InjectModel(Following.name)
    dbModel: Model<FollowingDocument>,
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
    console.log({ resourceId, userId })
    return this.dbModel.findOneAndDelete({ resourceId, userId })
  }

  async countFollowing(resourceId: Types.ObjectId) {
    const value = await this.dbModel.countDocuments({ resourceId })
    return { value }
  }
}
