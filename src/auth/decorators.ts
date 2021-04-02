import { SetMetadata } from '@nestjs/common'

export const SkipAuth = () => SetMetadata('isPublic', true)
