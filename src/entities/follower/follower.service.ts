import { Injectable, Inject } from '@nestjs/common'
import { CONTEXT } from '@nestjs/graphql'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

// Auth
// import { Action } from '../../casl/casl-ability.factory'

// Pagination
import { fromCursorHash, PaginationArgs } from '../../utils/Pagination'

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
    const limit = first ?? 0

    filters = filters ?? {}
    const options = {}

    if (first) {
      // In order to check if there is a next page, fetch one extra record
      options['limit'] = first + 1
    }
    // 'before' and 'after' are mutually exclusive. Because of this:
    if (after) {
      const afterDate = new Date(fromCursorHash(after))
      filters['createdAt'] = { $gt: afterDate.toISOString() }
    } else if (before) {
      const beforeDate = new Date(fromCursorHash(before))
      filters['createdAt'] = { $lt: beforeDate.toISOString() }
    }
    const result = await this.dbModel.find(filters, null, options).exec()
    let hasNextPage = false // Default behavior for empty result
    if (result?.length > 0) {
      hasNextPage = result.length === first + 1
    }

    // Build PaginatedSchool
    if (hasNextPage && limit > 0) {
      result.pop()
    }
    return {
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
  }
}
