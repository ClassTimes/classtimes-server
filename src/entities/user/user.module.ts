import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'

// import { AuthService } from '../auth/auth.service'
import { UserService } from './user.service'
import { User, UserSchema } from './user.model'
import { UserResolver } from './user.resolver'
// import { AuthModule } from '../auth/auth.module'

import { CaslAbilityFactory } from '../../casl/casl-ability.factory'
// import { PoliciesGuard } from '../../casl/policy.guard'

import { Follower, FollowerSchema } from '../follower/follower.model'
import { FollowerService } from '../follower/follower.service'

import { Following, FollowingSchema } from '../following/following.model'
import { FollowingService } from '../following/following.service'

@Module({
  imports: [
    // AuthModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
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
  // components: [AuthService],
  providers: [
    UserService,
    UserResolver,
    FollowerService,
    FollowingService,
    /*{
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },*/
    CaslAbilityFactory,
  ],
  exports: [UserService], // ?
})
export class UserModule {}
