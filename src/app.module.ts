import { Module } from '@nestjs/common'
import { join } from 'path'
import gitCommitInfo from 'git-commit-info'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { SendGridModule } from '@anchan828/nest-sendgrid'
import { MongooseModule } from '@nestjs/mongoose'
import * as Utils from './utils'
import { APP_GUARD } from '@nestjs/core'
import { GqlAuthGuard } from './modules/auth/gql-auth.guard'

// Modules
import { AuthModule } from './modules/auth/auth.module'
import { CalendarEventModule } from './entities/calendarEvent/calendarEvent.module'
import { CareerModule } from './modules/career/career.module'
import { CaslModule } from './modules/casl/casl.module'
import { DiscussionModule } from './modules/discussion/discussion.module'
import { EventModule } from './modules/event/event.module'
import { FollowModule } from './modules/follow/follow.module'
import { InstituteModule } from './modules/institute/institute.module'
// import { ImageKitAuthModule } from './imageKitAuth/imageKitAuth.module'
import { PermissonModule } from './entities/permisson/permisson.module'
import { SchoolModule } from './modules/school/school.module'
import { SubjectModule } from './entities/subject/subject.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [
    SendGridModule.forRoot({
      apikey: process.env.SENDGRID_API_KEY,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB || 'mongodb://localhost:27017/classtimes',
    ),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: false,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      introspection: true, // TODO Remove in production at release time
      installSubscriptionHandlers: true,
      context: (options) => {
        const { req } = options
        return { req }
      },
      formatResponse: (response) => {
        let extensions
        if (Utils.isDev) {
          const commit = gitCommitInfo() // information of process.cwd() and the latest commit
          const date = new Date().toISOString()
          extensions = {
            ...extensions,
            env: { date, commit },
          }
        }
        return {
          ...response,
          extensions,
        }
      },
    }),
    AuthModule,
    CalendarEventModule,
    CareerModule,
    CaslModule,
    DiscussionModule,
    EventModule,
    FollowModule,
    InstituteModule,
    // ImageKitAuthModule,
    PermissonModule,
    SchoolModule,
    SubjectModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GqlAuthGuard,
    },
  ],
})
export class AppModule {}
