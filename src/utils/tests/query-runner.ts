import supertest from 'supertest'
import { INestApplication } from '@nestjs/common'

interface RunQueryParams {
  variables?: Record<string, unknown>
  jwt?: string
}

export class QueryRunner {
  private app: INestApplication
  private query: string

  constructor(app: INestApplication, query: string) {
    this.app = app
    this.query = query
  }

  public runQuery(params?: RunQueryParams): supertest.Test {
    const { variables = {}, jwt } = params ?? {}

    const baseTest = supertest(this.app.getHttpServer()).post('/graphql').send({
      query: this.query,
      variables,
    })

    if (jwt) {
      return baseTest.set({ Authorization: `Bearer ${jwt}` })
    }

    return baseTest
  }
}
