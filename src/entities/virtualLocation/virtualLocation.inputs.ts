import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class VirtualLocationInput {
  @Field(() => String, { nullable: true })
  serviceType?: string

  @Field(() => String, { nullable: false })
  url: string

  @Field(() => String, { nullable: true })
  notes?: string
}
