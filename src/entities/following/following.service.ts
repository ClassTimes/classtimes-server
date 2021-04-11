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
    // await this.checkPermissons({ action: Action.Create })
    // const updatedPayload = {
    //   createdBy: this.currentUser,
    //   ...payload,
    // }
    return this.dbModel.create(payload)
  }

  //   async list(filters: ListSchoolInput) {
  //     const docs = await this.dbModel.find({ ...filters }).exec()
  //     for (const doc of docs) {
  //       await this.checkPermissons({ action: Action.Read, resourceId: doc._id })
  //     }
  //     return docs
  //   }
}
