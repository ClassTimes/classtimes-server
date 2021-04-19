import { Query, Resolver } from '@nestjs/graphql'
import { Type } from '@nestjs/common'

export function BaseResolver<T extends Type<unknown>>(classRef: T): any {
  @Resolver({ isAbstract: true })
  abstract class BaseResolverHost {
    @Query((type) => classRef, { name: `find${classRef.name}` })
    async find(): Promise<T[]> {
      return [] // ???
    }
  }
  return BaseResolverHost
}
