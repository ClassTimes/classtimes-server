import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import * as GQL from '@nestjs/graphql'
import { SendGridModule } from '@anchan828/nest-sendgrid'
import { join } from 'path'
import gitCommitInfo from 'git-commit-info'
import * as Utils from './utils'
import { APP_GUARD } from '@nestjs/core'
import { GqlAuthGuard } from './auth/gql-auth.guard'
// import { PoliciesGuard } from './casl/policy.guard'

// import {
//   ApolloErrorConverter, // required: core export
//   // mapItemBases, // optional: MapItem bases of common Errors that can be extended
//   // extendMapItem, // optional: tool for extending MapItems with new configurations
// } from 'apollo-error-converter'

// App
import { AppController } from './app.controller'
import { AppService } from './app.service'

// Modules
import { AuthModule } from './auth/auth.module'
import { CalendarEventModule } from './entities/calendarEvent/calendarEvent.module'
import { CareerModule } from './entities/career/career.module'
import { CaslModule } from './casl/casl.module'
import { DiscussionModule } from './entities/discussion/discussion.module'
import { EventModule } from './entities/event/event.module'
import { FollowModule } from './entities/follow/follow.module'
import { InstituteModule } from './entities/institute/institute.module'
import { ImageKitAuthModule } from './imageKitAuth/imageKitAuth.module'
import { PermissonModule } from './entities/permisson/permisson.module'
import { SchoolModule } from './entities/school/school.module'
import { SubjectModule } from './entities/subject/subject.module'
import { UserModule } from './entities/user/user.module'

// import { ValidationError } from 'class-validator'

@Module({
  imports: [
    SendGridModule.forRoot({
      apikey: process.env.SENDGRID_API_KEY,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB || 'mongodb://localhost/classtimes',
    ),
    GQL.GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      // dateScalarMode: 'timestamp',
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      debug: false,
      introspection: true, // TODO Remove in production at release time
      // context: ({ req }) => ({ req }),
      context: (options) => {
        // console.log(`[GQL] [context]`, { options: Object.keys(options) })
        const { req } = options
        // console.log(`[GQL] [context] [req]`, { req: Object.keys(req) })
        // res.header('key', 'value')
        return { req }
      },
      formatResponse: (response, options) => {
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
      // formatError: new ApolloErrorConverter({
      //   // logger,
      //   // fallback,
      //   // errorMap
      // }),
    }),
    AuthModule,
    CalendarEventModule,
    CaslModule,
    CareerModule,
    DiscussionModule,
    EventModule,
    FollowModule,
    InstituteModule,
    ImageKitAuthModule,
    PermissonModule,
    SchoolModule,
    SubjectModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: GqlAuthGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: PoliciesGuard,
    // },
    // ObjectidScalar,
    // Logger,
    // JwtStrategy,
  ],
})
export class AppModule {}
