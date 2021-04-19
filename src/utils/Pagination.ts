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
  @Field((type) => String)
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

export interface PaginatedType<T> {
  edges: {
    cursor?: string
    node: T
  }
  pageInfo?: {
    endCursor?: string
    hasNextPage?: boolean
  }
  totalCount?: number
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
    const date = new Date(this.createdAt)
    return toCursorHash(date.toISOString())
  })
  return schema
}
