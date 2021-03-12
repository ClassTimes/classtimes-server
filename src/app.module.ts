import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'

// App
import { AppController } from './app.controller'
import { AppService } from './app.service'

// Models
import { SchoolModule } from './school/school.module'
import { CalendarModule } from './calendar/calendar.module'
import { EventModule } from './event/event.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB || 'mongodb://localhost/classtimes',
    ),
    GraphQLModule.forRoot({
      // installSubscriptionHandlers: true,
      // dateScalarMode: 'timestamp',
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      debug: false,
      introspection: true, // TODO Remove in production at release time
    }),
    SchoolModule,
    CalendarModule,
    EventModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
