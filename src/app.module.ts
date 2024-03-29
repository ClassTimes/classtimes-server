import { Module } from '@nestjs/common'
import { join } from 'path'
import gitCommitInfo from 'git-commit-info'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { SendGridModule } from '@anchan828/nest-sendgrid'
import { MongooseModule } from '@nestjs/mongoose'
import * as Utils from './utils'
import { APP_GUARD } from '@nestjs/core'
import { GqlAuthGuard } from './modules/auth/gql-auth.guard'
import { EConfiguration } from '@utils/enum'

// Modules
import { AuthModule } from './modules/auth/auth.module'
import { CalendarEventModule } from './modules/calendarEvent/calendarEvent.module'
import { CareerModule } from './modules/career/career.module'
import { CaslModule } from './modules/casl/casl.module'
import { DiscussionModule } from './modules/discussion/discussion.module'
import { EventModule } from './modules/event/event.module'
import { FollowModule } from './modules/follow/follow.module'
import { InstituteModule } from './modules/institute/institute.module'
// import { ImageKitAuthModule } from './imageKitAuth/imageKitAuth.module'
import { PermissonModule } from './modules/permisson/permisson.module'
import { SchoolModule } from './modules/school/school.module'
import { SubjectModule } from './modules/subject/subject.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SendGridModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (_config: ConfigService) => ({
        apikey: _config.get(EConfiguration.SENDGRID_API_KEY),
      }),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (_config: ConfigService) => ({
        uri:
          _config.get(EConfiguration.MONGODB_URL) ||
          'mongodb://localhost/classtimes',
      }),
    }),
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
