import { Args, Mutation, Query, Resolver, ID } from '@nestjs/graphql'
import { Types } from 'mongoose'
import { PermissonService } from './permisson.service'
import { WritePermissonsInput } from './permisson.inputs'

@Resolver()
export class PermissonResolver {
  constructor(private service: PermissonService) {}

  @Mutation()
  async writePermissons(@Args('payload') payload: WritePermissonsInput) {
    //return this.service.update(payload)
  }
}
