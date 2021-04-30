import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }

@GQL.ObjectType()
export class ImageKitAuth {
  @GQL.Field(() => String, { nullable: false })
  token: string

  @GQL.Field(() => GQL.Int, { nullable: false })
  expire: number

  @GQL.Field(() => String, { nullable: false })
  signature: string
}
