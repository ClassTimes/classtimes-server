import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as V from 'class-validator'
import mongoose from 'mongoose'
import { ApolloError } from 'apollo-server-errors'
import { plainToInstance } from 'class-transformer'
import pluralize from 'pluralize'
import titleize from 'titleize'
import {
  accessibleFieldsPlugin,
  accessibleRecordsPlugin,
  AccessibleModel,
  AccessibleFieldsDocument,
} from '@casl/mongoose'

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
  }
}

/**
 * Decorator
 */
export function ValidateSchema() {
  return function <T extends typeof BaseModel>(target: T) {
    target.__validate__ = true
    return target
  }
}

interface IOneToManyOptions {
  ref?: string
  foreignField?: string
  localField?: string
  propertyKey?: string
}

export function OneToMany(options: IOneToManyOptions = {}) {
  const { ref, foreignField, localField, propertyKey: _propertyKey } = options
  return (target: any, propertyKey: string) => {
    const model = target.constructor as typeof BaseModel
    model.__assoc__ = model.__assoc__ || {}
    model.__assoc__['OneToMany'] = model.__assoc__['OneToMany'] || []
    model.__assoc__['OneToMany'].push({
      target,
      propertyKey: _propertyKey ?? propertyKey,
      ref,
      foreignField,
      localField,
    })
  }
}

interface IVirtualOptions {
  ref?: string
  refPath?: string
  foreignField?: string
  localField?: string
  propertyKey?: string
}

export function Virtual(options: IVirtualOptions = {}) {
  const {
    ref,
    foreignField,
    localField,
    propertyKey: _propertyKey,
    refPath,
  } = options
  return (target: any, propertyKey: string) => {
    const model = target.constructor as typeof BaseModel
    model.__virtuals__ = model.__virtuals__ || []
    model.__virtuals__.push({
      target,
      propertyKey: _propertyKey ?? propertyKey,
      ref,
      foreignField,
      localField,
      refPath,
    })
  }
}

/**
 * Base Model
 */
@ValidateSchema()
@DB.Schema({
  timestamps: true,
  // autoIndex: true
})
export class BaseModel {
  static __validate__: boolean | undefined
  static __assoc__: Record<string, any> | undefined
  static __virtuals__: Array<Record<string, any>> | undefined
  static schema?: ReturnType<typeof DB.SchemaFactory.createForClass>

  @DB.Prop({
    type: mongoose.Schema.Types.Mixed,
    required: false,
  })
  roles?: Record<string | symbol, unknown> // TODO: Improve model
}

// Validation
const SCHEMA_CACHE_KEY = `__schema__`
Object.defineProperty(BaseModel, 'schema', {
  get: function () {
    if (this[SCHEMA_CACHE_KEY]) {
      return this[SCHEMA_CACHE_KEY]
    }
    const schema = DB.SchemaFactory.createForClass(this)
    this[SCHEMA_CACHE_KEY] = schema
    // eslint-disable-next-line
    const klass = this

    // One-to-Many virtuals
    const assocs = this?.__assoc__?.['OneToMany']
    if (assocs) {
      for (const assoc of assocs) {
        // TODO Cleanup to a function
        const {
          target,
          propertyKey,
          foreignField: _foreignField,
          ref: _ref,
          refPath: _refPath,
          localField: _localField,
        } = assoc
        const model = target.constructor as typeof BaseModel
        const foreignField = _foreignField ?? model.name.toLowerCase()
        const localField = _localField ?? '_id'
        const refPath = _refPath ?? undefined
        const ref = _ref ?? titleize(pluralize.singular(`${propertyKey}`))
        model?.schema.virtual(propertyKey, {
          ref,
          refPath,
          localField,
          foreignField,
          autopopulate: true,
        })
        model?.schema.set('toObject', { virtuals: true })
        model?.schema.set('toJSON', { virtuals: true })
      }
    }

    // Virtuals
    const virtuals = this?.__virtuals__
    if (virtuals) {
      for (const virtual of virtuals) {
        // TODO Cleanup to a function
        const {
          target,
          propertyKey,
          foreignField: _foreignField,
          ref: _ref,
          refPath: _refPath,
          localField: _localField,
        } = virtual
        const model = target.constructor as typeof BaseModel
        const foreignField = _foreignField ?? model.name.toLowerCase()
        const localField = _localField ?? '_id'
        const refPath = _refPath ?? undefined
        const ref = _ref ?? titleize(pluralize.singular(`${propertyKey}`))
        model?.schema.virtual(propertyKey, {
          ref,
          refPath,
          localField,
          foreignField,
          autopopulate: true,
          justOne: true,
        })
        model?.schema.set('toObject', { virtuals: true })
        model?.schema.set('toJSON', { virtuals: true })
      }
    }

    // Validations
    if (this['__validate__']) {
      // TODO Cleanup to a function
      schema.pre('validate', async function (next) {
        const modelData = this.toObject()
        const model = plainToInstance(klass, modelData)
        try {
          //console.log('model', model)
          await V.validateOrReject(model as Record<string, unknown>)
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
