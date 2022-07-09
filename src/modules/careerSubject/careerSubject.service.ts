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
} from '@utils/Connection'

// CareerSubject
import { CareerSubject, CareerSubjectDocument } from './careerSubject.model'
import { CreateCareerSubjectInput } from './careerSubject.inputs'

@Injectable()
export class CareerSubjectService {
  dbModel: Model<CareerSubjectDocument>

  constructor(
    @InjectModel(CareerSubject.name)
    dbModel: Model<CareerSubjectDocument>,
    // @Inject(CONTEXT) context,
  ) {
    // super()
    this.dbModel = dbModel
    // this.context = context
  }

  async create(payload: CreateCareerSubjectInput) {
    return this.dbModel.create(payload)
  }

  // async delete(
  //   resourceId: Types.ObjectId,
  //   followerId: Types.ObjectId | string,
  // ) {
  //   return this.dbModel
  //     .findOneAndDelete({ resourceId, followerId })
  //     .populate('resource')
  //     .populate('follower')
  // }

  // Pagination

  async list(filters?: any, connectionArgs?: ConnectionArgs) {
    const { first, after, before } = connectionArgs

    const { result, hasNextPage } = await getConnectionResults<CareerSubject>({
      dbModel: this.dbModel,
      filters,
      first,
      after,
      before,
    })

    const paginatedResult = {
      edges: result?.map((doc) => {
        return {
          node: doc.subject,
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
