import { Injectable, Inject } from '@nestjs/common'
import { CONTEXT } from '@nestjs/graphql'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { plainToClass } from 'class-transformer'

// Auth
// import { Action } from '../../casl/casl-ability.factory'

// Pagination
import { fromCursorHash, PaginationArgs } from '../../utils/Pagination'

// Entities
import { User } from '../user/user.model'

// Following
import { Following, FollowingDocument } from './following.model'
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

  async delete(
    resourceId: Types.ObjectId,
    followerId: Types.ObjectId | string,
  ) {
    return this.dbModel
      .findOneAndDelete({
        resourceId,
        followerId,
      })
      .populate('resource')
      .populate('follower')

    // TODO: Check why autopopulate doesn't work on delete/remove
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
      hasNextPage = result.length === limit + 1
    }

    // Build PaginatedSchool
    if (hasNextPage && limit > 0) {
      result.pop()
    }

    const paginatedResult = {
      edges: result.map((doc) => {
        console.log(doc.resourceName)
        return {
          node: doc.resource, // Tengo que hacer algun tipo de type assertion aca...
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
