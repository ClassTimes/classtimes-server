import { Module } from '@nestjs/common'

import { ImageKitAuthController } from './imageKitAuth.controller'

@Module({
  controllers: [ImageKitAuthController],
})
export class ImageKitAuthModule {}
