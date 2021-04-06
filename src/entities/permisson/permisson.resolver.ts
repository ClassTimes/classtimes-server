import { Args, Mutation, Query, Resolver, ID } from '@nestjs/graphql'
import { Types } from 'mongoose'
import { Permisson } from './permisson.model'
import { PermissonService } from './permisson.service'
import { WritePermissonsInput } from './permisson.inputs'

@Resolver()
export class PermissonResolver {
  constructor(private service: PermissonService) {}

  @Mutation(() => Permisson)
  async writePermisson(@Args('payload') payload: WritePermissonsInput) {
    return this.service.writePermisson(payload)
  }
}
