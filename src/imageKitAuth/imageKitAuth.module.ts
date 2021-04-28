import { Module } from '@nestjs/common'

import { ImageKitAuthResolver } from './imageKitAuth.resolver'
import { ImageKitAuthService } from './imageKitAuth.service'
import { ImageKitAuthController } from './imageKitAuth.controller'

@Module({
  controllers: [ImageKitAuthController],
})
export class ImageKitAuthModule {}
