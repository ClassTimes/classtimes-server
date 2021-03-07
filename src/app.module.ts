import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'

// App
import { AppController } from './app.controller'
import { AppService } from './app.service'

// School
import { SchoolModule } from './school/school.module'

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/classtimes'),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      debug: false,
    }),
    SchoolModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
