import { Field, ObjectType, Int } from '@nestjs/graphql'
import { Type } from '@nestjs/common'
import { Base64 } from 'js-base64'

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

//

export const toCursorHash = (str: string) => Base64.encode(str)
export const fromCursorHash = (str: string) => Base64.decode(str)
