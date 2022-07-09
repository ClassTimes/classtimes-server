export { AuthenticationError } from 'apollo-server-errors'

// export class  extends AuthenticationError {
//   public path: any[]
//   public name: string
//   message = this.constructor.name
//   // public errors?: ApolloError[]

//   constructor(
//     path?: any[],
//     extensions?: Record<string, any>,
//     message?: string,
//   ) {
//     super(message, 'MODEL_VALIDATION_FAILED', extensions)
//     this.path = path
//     // this.name = 'ModelValidationError'
//     // Object.defineProperty(this, 'name', { value: 'ValidationError' })
//   }
// }
