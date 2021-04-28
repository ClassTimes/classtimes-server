import { Args, Query, Resolver, ID } from '@nestjs/graphql'
import { Types } from 'mongoose'

import { SkipAuth } from '../auth/decorators'

import { ImageKitAuth } from './imageKitAuth.model'
import { ImageKitAuthService } from './imageKitAuth.service'

@Resolver(() => ImageKitAuth)
export class ImageKitAuthResolver {
  constructor(private service: ImageKitAuthService) {}

  @Query(() => ImageKitAuth)
  @SkipAuth()
  async getImageKitAuthentication(@Args('publicKey') publicKey: string) {
    return this.service.getAuthentication(publicKey)
  }
}
