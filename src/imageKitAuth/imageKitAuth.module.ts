import { Module } from '@nestjs/common'

import { ImageKitAuthController } from './imageKitAuth.controller'
import { ImageKitAuthResolver } from './imageKitAuth.resolver'
import { ImageKitAuthService } from './imageKitAuth.service'

@Module({
  controllers: [ImageKitAuthController],
  providers: [ImageKitAuthResolver, ImageKitAuthService],
})
export class ImageKitAuthModule {}
