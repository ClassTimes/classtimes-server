import * as dotenv from 'dotenv'
dotenv.config()

import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
// import { ValidationError as ApolloValidationError } from 'apollo-server-core'
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import duration from 'dayjs/plugin/duration'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import weekday from 'dayjs/plugin/weekday'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import { AppModule } from './app.module'

dayjs.extend(duration)
dayjs.extend(localeData)
dayjs.extend(localizedFormat)
dayjs.extend(weekday)
dayjs.extend(utc)
dayjs.extend(timezone)

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  if (process.env.NODE_ENV === 'production') {
    app.enableCors() // protection
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // exceptionFactory: (_error) => {
      //   const error = new ApolloValidationError('VALIDATION_ERROR')
      //   // error.originalError = _error

      //   // Object.defineProperty(errors, 'error_test', {
      //   //   value: 123,
      //   //   // 'UserInputError'
      //   // })
      //   return error
      // },
    }),
  )
  await app.listen(process.env.PORT || 3000)
}
bootstrap()
