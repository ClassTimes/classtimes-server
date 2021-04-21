import { Field, ObjectType, ArgsType, Int } from '@nestjs/graphql'
import mongoose from 'mongoose'
import { Type } from '@nestjs/common'
import { Base64 } from 'js-base64'

// *
// *
// Pagination Types
// *
// *

@ObjectType()
class PageInfoType {
  @Field((type) => String, { nullable: true })
  endCursor: string

  @Field((type) => Boolean)
  hasNextPage: boolean
}

export function Paginated<T>(classRef: Type<T>): any {
  @ObjectType(`${classRef.name}Edge`)
  abstract class EdgeType {
    @Field((type) => String)
    cursor: string

    @Field((type) => classRef)
    node: T
  }
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field((type) => [EdgeType], { nullable: true })
    edges: EdgeType[]

    @Field((type) => PageInfoType)
    pageInfo: PageInfoType

    @Field((type) => Int)
    totalCount: number
  }
  return PaginatedType
}

// *
// *
// Pagination object
// *
// *
export interface PaginatedType<T> {
  edges: {
    cursor?: string
    node: T
  }[]
  pageInfo?: {
    endCursor?: string
    hasNextPage?: boolean
  }
  totalCount?: number
}

export interface PaginatedResult<T> {
  result: T[]
  hasNextPage: boolean
}

interface PaginationOptions {
  dbModel: any // Mejorar esto
  filters?: any
  first?: number
  after?: string
  before?: string
}

export async function getConnection<T>(
  options: PaginationOptions,
): Promise<PaginatedType<T>> {
  const { result, hasNextPage } = await getPaginatedResults<T>(options)
  return buildConnection(result, hasNextPage)
}

export async function getPaginatedResults<T>(
  options: PaginationOptions,
): Promise<PaginatedResult<T>> {
  const { dbModel, filters, first, after, before } = options

  const limit = first ?? 0
  const queryFilters = filters ?? {}
  const queryOptions = {}

  if (limit > 0) {
    // In order to check if there is a next page, fetch one extra record
    queryOptions['limit'] = limit + 1
  }

  // 'before' and 'after' are mutually exclusive. Because of this:
  if (after) {
    const afterDate = new Date(fromCursorHash(after))
    queryFilters['createdAt'] = { $gt: afterDate.toISOString() }
  } else if (before) {
    const beforeDate = new Date(fromCursorHash(before))
    queryFilters['createdAt'] = { $lt: beforeDate.toISOString() }
  }
  const result = await dbModel.find(queryFilters, null, queryOptions).exec()

  let hasNextPage = false // Default behavior for empty result
  if (result?.length > 0) {
    hasNextPage = result.length === first + 1
  }

  if (hasNextPage && limit > 0) {
    result.pop()
  }

  return { result, hasNextPage }
}

export function buildConnection<T>(
  documents: Array<T>,
  hasNextPage: boolean,
): PaginatedType<T> {
  return {
    edges: documents.map((doc) => {
      return {
        node: doc,
        cursor: (doc as any).cursor, // TODO: Remove this 'any' in favor of the correct type
      }
    }),
    totalCount: documents?.length,
    pageInfo: {
      endCursor: (documents[documents.length - 1] as any)?.cursor,
      hasNextPage,
    },
  }
}

// *
// *
// Pagination Args
// *
// *
@ArgsType()
export class PaginationArgs {
  @Field({ defaultValue: 0 }) // TODO: Actually have this as non-nullable
  first?: number

  @Field({ nullable: true })
  after?: string

  @Field({ nullable: true })
  before?: string
}

// *
// *
// Cursor base64 encoding
// *
// *

export const toCursorHash = (str: string) => Base64.encode(str)
export const fromCursorHash = (str: string) => Base64.decode(str)

// *
// *
// Add cursor to schema
// * Note: this assumes the presence of timestamps, specifically the createdAt field.
// ** if this is not present, this will throw an error.
export const withCursor = function (schema: mongoose.Schema) {
  schema.index({ createdAt: 1 })
  schema.virtual('cursor').get(function () {
    if (this.createdAt) {
      const date = new Date(this.createdAt)
      return toCursorHash(date.toISOString())
    }
    return null
  })
  return schema
}
