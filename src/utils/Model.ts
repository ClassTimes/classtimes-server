import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import { ApolloError } from 'apollo-server-errors'
import { plainToClass } from 'class-transformer'
import * as V from 'class-validator'

export class ModelValidationError extends ApolloError {
  public path: any[]
  public name: string
  message = this.constructor.name
  // public errors?: ApolloError[]

  constructor(
    path?: any[],
    extensions?: Record<string, any>,
    message?: string,
  ) {
    super(message, 'MODEL_VALIDATION_FAILED', extensions)
    this.path = path
    // this.name = 'ModelValidationError'
    // Object.defineProperty(this, 'name', { value: 'ValidationError' })
  }
}

/**
 * Decorator
 */
export function ValidateSchema() {
  return function <T extends typeof Model>(target: T) {
    target.__validate__ = true
    return target
  }
}

/**
 * Base Model
 */
export class Model {
  static __validate__: boolean | undefined
  static schema?: ReturnType<typeof DB.SchemaFactory.createForClass>
}

// Validation
const SCHEMA_CACHE_KEY = `__schema__`
Object.defineProperty(Model, 'schema', {
  get: function () {
    if (this[SCHEMA_CACHE_KEY]) {
      return this[SCHEMA_CACHE_KEY]
    }
    const schema = DB.SchemaFactory.createForClass(this)
    this[SCHEMA_CACHE_KEY] = schema
    // eslint-disable-next-line
    const klass = this

    if (this['__validate__']) {
      schema.pre('validate', async function (next) {
        const modelData = this.toObject()
        const model = plainToClass(klass, modelData)

        try {
          console.log('model', model)
          await V.validateOrReject(model)
        } catch (_errors) {
          console.log('_errors', _errors)
          const paths = new Set()
          const errors = []
          for (const error of _errors) {
            // console.log('error', error)
            paths.add(error.property)
            if (error && 'constraints' in error) {
              for (const [constraintName, errorMessage] of Object.entries(
                error.constraints,
              )) {
                // console.log('key', { constraintName, errorMessage, error })
                errors.push({
                  constraintName,
                  errorMessage,
                  path: error.property,
                })
              }
            }
          }

          const pathsArray = [...paths]
          const extensions = {
            failedValidations: errors,
          }
          const validationError = new ModelValidationError(
            pathsArray,
            extensions,
          )
          next(validationError)
        }
      })
    }

    return this[SCHEMA_CACHE_KEY]
  },
})
