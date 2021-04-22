import { Injectable, Inject } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
// import { CONTEXT } from '@nestjs/graphql'
// import { plainToClass } from 'class-transformer'

// Auth
// import { Action } from '../../casl/casl-ability.factory'

// Pagination
import { PaginationArgs, getPaginatedResults } from '../../utils/Pagination'

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

    const { result, hasNextPage } = await getPaginatedResults<Following>({
      dbModel: this.dbModel,
      filters,
      first,
      after,
      before,
    })

    const paginatedResult = {
      edges: result?.map((doc) => {
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
