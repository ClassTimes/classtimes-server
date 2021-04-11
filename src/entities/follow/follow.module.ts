import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { FollowResolver } from './follow.resolver'

import { Follower, FollowerSchema } from '../follower/follower.model'
import { FollowerService } from '../follower/follower.service'
// import { FollowerResolver } from '../follower/follower.resolver'

import { Following, FollowingSchema } from '../following/following.model'
import { FollowingService } from '../following/following.service'
// import { FollowingResolver } from '../following/following.resolver'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Follower.name,
        schema: FollowerSchema,
      },
      {
        name: Following.name,
        schema: FollowingSchema,
      },
    ]),
  ],
  providers: [FollowResolver, FollowerService, FollowingService],
})
export class FollowModule {}
