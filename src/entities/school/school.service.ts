import { Injectable, Inject } from '@nestjs/common'
import { CONTEXT } from '@nestjs/graphql'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

// Service
import { BaseService } from '../../utils/BaseService'

// Auth
import { Action } from '@modules/casl/casl-ability.factory'

// School
import { School, SchoolDocument } from './school.model'
import { CreateSchoolInput } from './school.inputs'

const MODEL_CLASS = School
@Injectable()
export class SchoolService extends BaseService<School> {
  modelClass = MODEL_CLASS
  dbModel: Model<SchoolDocument>
  context

  constructor(
    @InjectModel(MODEL_CLASS.name)
    dbModel: Model<SchoolDocument>,
    @Inject(CONTEXT) context,
  ) {
    super()
    this.dbModel = dbModel
    this.context = context
  }

  async create(payload: CreateSchoolInput) {
    await this.checkPermissons({ action: Action.Create })
    const model = new this.dbModel(payload)
    model['createdBy'] = this.currentUser
    return model.save()
  }

  // async list(filters: ListSchoolInput, first?: number, offset?: number) {
  //   // const docs = await this.dbModel.find({ ...filters }).exec()
  //   // for (const doc of docs) {
  //   //   await this.checkPermissons({ action: Action.Read, resourceId: doc._id })
  //   // }
  //   // return docs
  //   const options = {}
  //   first ? (options['limit'] = first) : null
  //   offset ? (options['skip'] = offset) : null
  //   const result = await this.dbModel.find({ ...filters }, null, options).exec()
  //   const { length, ...docs } = result
  //   return { nodes: Object.values(docs), totalCount: length }
  // }

  // async list(first?: number, after?: string, before?: string) {
  //   const filters = {}
  //   const options = {}

  //   if (first) {
  //     options['limit'] = first + 1 // In order to check if there is a next page
  //   }

  //   // 'before' and 'after' are mutually exclusive. Because of this:
  //   if (after) {
  //     const afterDate = new Date(fromCursorHash(after))
  //     filters['createdAt'] = { $gt: afterDate }
  //   } else if (before) {
  //     const beforeDate = new Date(fromCursorHash(before))
  //     filters['createdAt'] = { $lt: beforeDate }
  //   }

  //   const result = await this.dbModel.find(filters, null, options).exec()
  //   const hasNextPage = result?.length === first + 1

  //   // Build PaginatedSchool
  //   if (hasNextPage) {
  //     result.pop()
  //   }
  //   return {
  //     edges: result.map((doc) => {
  //       return {
  //         node: doc,
  //         cursor: doc.cursor,
  //       }
  //     }),
  //     totalCount: result?.length,
  //     pageInfo: {
  //       endCursor: result[result.length - 1]?.cursor,

  //       hasNextPage,
  //     },
  //   }
  // }
}
