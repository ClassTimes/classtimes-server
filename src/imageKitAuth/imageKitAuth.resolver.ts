import { Query, Resolver, Args } from '@nestjs/graphql'

import { SkipAuth } from '../auth/decorators'

import { ImageKitAuth } from './imageKitAuth.model'
import { ImageKitAuthService } from './imageKitAuth.service'

@Resolver(() => ImageKitAuth)
export class ImageKitAuthResolver {
  constructor(private service: ImageKitAuthService) {}

  @Query(() => ImageKitAuth)
  @SkipAuth() // TODO: Check if user has permisson.
  getImageKitSignature(@Args('publicKey') publicKey: string): ImageKitAuth {
    return this.service.getAuthenticationParameters(publicKey)
  }
}
