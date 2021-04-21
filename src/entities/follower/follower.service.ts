import { Injectable, Inject } from '@nestjs/common'
import { CONTEXT } from '@nestjs/graphql'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

// Auth
// import { Action } from '../../casl/casl-ability.factory'

// Pagination
import {
  fromCursorHash,
  PaginationArgs,
  getPaginatedResults,
  buildConnection,
} from '../../utils/Pagination'

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
    // console.log({ resourceId, followerId })
    return this.dbModel
      .findOneAndDelete({ resourceId, followerId })
      .populate('resource')
      .populate('follower')
  }

  // Pagination

  async list(filters?: any, paginationArgs?: PaginationArgs) {
    const { first, after, before } = paginationArgs

    const { result, hasNextPage } = await getPaginatedResults<Follower>({
      dbModel: this.dbModel,
      filters,
      first,
      after,
      before,
    })

    const paginatedResult = {
      edges: result.map((doc) => {
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
