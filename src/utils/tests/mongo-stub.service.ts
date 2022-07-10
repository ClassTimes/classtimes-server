import { MongoMemoryServer } from 'mongodb-memory-server'
import { Connection, connect, Model } from 'mongoose'
import { User, UserSchema } from '@modules/user/user.model'
import { CreateUserInput } from '@modules/user/user.inputs'
import { hashPasswordForPayload } from '@utils/helpers/hash-password'

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
  private UserModel: Model<User>

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

    // Set up models
    this.UserModel = this.connection.model(User.name, UserSchema)

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

  /**
   * createStubbedUser
   *
   * Creates a stubbed user from the provided payload
   *
   * @param {CreateUserInput} input
   * @returns {Promise<void>}
   */
  public async createUser(input: CreateUserInput): Promise<void> {
    const payload = await hashPasswordForPayload(input)
    const record = new this.UserModel(payload)
    await record.save()
  }
}
