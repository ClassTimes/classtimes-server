import * as mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

const MONGO_SERVER = new MongoMemoryServer()

/**
 * Connect to the in-memory database.
 */
export async function connectFakeMongo() {
  const opts = {
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
  }

  const mongoUri = await MONGO_SERVER.getUri()
  const result = await mongoose.connect(mongoUri, opts)
  //    (err) => {
  //   if (err) {
  //     console.error(err)
  //   }
  // })

  // mongoose.connection.on('error', (e) => {
  //   if (e.message.code === 'ETIMEDOUT') {
  //     // console.log(e)
  //     mongoose.connect(mongoUri, opts)
  //   }
  //   // console.log(e)
  // })

  // mongoose.connection.once('open', () => {
  //   console.log(`MongoDB successfully connected`)
  // })

  return result
}

/**
 * Drop database, close the connection and stop mongod.
 */
export async function disconnectFakeMongo() {
  //   await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await MONGO_SERVER.stop()
}

/**
 * Remove all the data for all db collections.
 */
// // export async function disconnectFakeMongo() {
//   // throw new Error('TODO')
//   //   const collections = mongoose.connection.collections
//   //   for (const key in collections) {
//   //     const collection = collections[key]
//   //     await collection.deleteMany()
//   //   }
// }
