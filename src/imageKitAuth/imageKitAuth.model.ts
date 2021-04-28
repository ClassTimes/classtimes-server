import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import * as Utils from '../utils/Model'

@GQL.ObjectType()
export class ImageKitAuth extends Utils.BaseModel {
  @GQL.Field(() => String, { nullable: false })
  token: string

  @GQL.Field(() => GQL.Int, { nullable: false })
  expire: number

  @GQL.Field(() => String, { nullable: false })
  signature: string
}

//
// # Reference Link
//
// https://github.com/bmoeskau/Extensible/blob/master/recurrence-overview.md
