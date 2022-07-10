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
