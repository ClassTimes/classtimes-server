import { Args, Mutation, Resolver } from '@nestjs/graphql'
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
