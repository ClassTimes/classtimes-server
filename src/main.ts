import { NestFactory } from '@nestjs/core'

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
// import 'dayjs/plugin/utc'
dayjs.extend(utc)

import { AppModule } from './app.module'

// dayjs.extend(utc)

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  if (process.env.NODE_ENV === 'production') {
    app.enableCors() // protection
  }
  await app.listen(process.env.PORT || 3000)
}
bootstrap()
