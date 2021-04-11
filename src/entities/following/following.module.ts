import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Following, FollowingSchema } from './following.model'
import { FollowingService } from './following.service'
import { FollowingResolver } from './following.resolver'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Following.name,
        schema: FollowingSchema,
      },
    ]),
  ],
  providers: [FollowingResolver, FollowingService],
})
export class FollowingModule {}
