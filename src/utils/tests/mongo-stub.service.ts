import { MongoMemoryServer } from 'mongodb-memory-server'
import { Connection, connect } from 'mongoose'

interface MongoConnection {
  connection: Connection
  uri: string
}

/**
 * MongoStubService
 *
 * A basic fake mongo instance to use with tests
 * Inspired by:
 * https://betterprogramming.pub/testing-controllers-in-nestjs-and-mongo-with-jest-63e1b208503c
 */
export class MongoStubService {
  private mongod: MongoMemoryServer
  private connection: Connection

  /**
   * init
   *
   * Starts and connects the mongo instance, while also giving the user access to
   * the connection object
   *
   * @returns {Promise<MongoConnection>}
   */
  public async init(): Promise<MongoConnection> {
    this.mongod = await MongoMemoryServer.create()
    const uri = this.mongod.getUri()
    this.connection = (await connect(uri)).connection

    return { connection: this.connection, uri }
  }

  /**
   * close
   *
   * Stops and drops the stubbed mongo instance.
   *
   * @returns {Promise<void>}
   */
  public async close(): Promise<void> {
    await this.connection.dropDatabase()
    await this.connection.close()
    await this.mongod.stop()
  }
}

// /**
//  * Connect to the in-memory database.
//  */
// export async function connectFakeMongo() {
//   // const opts = {
//   //   autoReconnect: true,
//   //   reconnectTries: Number.MAX_VALUE,
//   //   reconnectInterval: 1000,
//   // }

//   const mongoUri = await MONGO_SERVER.getUri()
//   const result = await mongoose.connect(mongoUri)
//   //    (err) => {
//   //   if (err) {
//   //     console.error(err)
//   //   }
//   // })

//   // mongoose.connection.on('error', (e) => {
//   //   if (e.message.code === 'ETIMEDOUT') {
//   //     // console.log(e)
//   //     mongoose.connect(mongoUri, opts)
//   //   }
//   //   // console.log(e)
//   // })

//   // mongoose.connection.once('open', () => {
//   //   console.log(`MongoDB successfully connected`)
//   // })

//   return result
// }

// /**
//  * Drop database, close the connection and stop mongod.
//  */
// export async function disconnectFakeMongo() {
//   //   await mongoose.connection.dropDatabase()
//   await mongoose.connection.close()
//   await MONGO_SERVER.stop()
// }

// /**
//  * Remove all the data for all db collections.
//  */
// // // export async function disconnectFakeMongo() {
// //   // throw new Error('TODO')
// //   //   const collections = mongoose.connection.collections
// //   //   for (const key in collections) {
// //   //     const collection = collections[key]
// //   //     await collection.deleteMany()
// //   //   }
// // }
