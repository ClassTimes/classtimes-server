import { Injectable, Inject } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
// import { CONTEXT } from '@nestjs/graphql'

// Auth
// import { Action } from '../../casl/casl-ability.factory'

// Pagination
import {
  ConnectionArgs,
  getConnectionResults,
  // buildConnection,
} from '../../utils/Connection'

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

  async delete(
    resourceId: Types.ObjectId,
    followerId: Types.ObjectId | string,
  ) {
    return this.dbModel
      .findOneAndDelete({ resourceId, followerId })
      .populate('resource')
      .populate('follower')
  }

  // Pagination

  async list(filters?: any, connectionArgs?: ConnectionArgs) {
    const { first, after, before } = connectionArgs

    const { result, hasNextPage } = await getConnectionResults<Follower>({
      dbModel: this.dbModel,
      filters,
      first,
      after,
      before,
    })

    const paginatedResult = {
      edges: result?.map((doc) => {
        return {
          node: doc.follower,
          cursor: (doc as any).cursor,
        }
      }),
      totalCount: result?.length,
      pageInfo: {
        endCursor: (result[result.length - 1] as any)?.cursor,

        hasNextPage,
      },
    }

    return paginatedResult
  }
}
