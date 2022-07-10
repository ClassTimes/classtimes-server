import supertest from 'supertest'
import { INestApplication } from '@nestjs/common'

interface RunQueryParams {
  app: INestApplication
  query: string
  variables: Record<string, unknown>
  jwt?: string
}

export const runQuery = (params: RunQueryParams): supertest.Test => {
  const { app, query, variables, jwt } = params

  const baseTest = supertest(app.getHttpServer()).post('/graphql').send({
    query,
    variables,
  })

  if (jwt) {
    return baseTest.set({ Authorization: `Bearer ${jwt}` })
  }

  return baseTest
}
