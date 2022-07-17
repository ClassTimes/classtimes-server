import { APP_GUARD } from '@nestjs/core'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { SendGridModule } from '@anchan828/nest-sendgrid'
import { GraphQLModule } from '@nestjs/graphql'
import { GqlAuthGuard } from '@modules/auth/gql-auth.guard'
import { AuthModule } from '@modules/auth/auth.module'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { EConfiguration } from '@utils/enum'
import { join } from 'path'

export const baseImports = [
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  SendGridModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (_config: ConfigService) => ({
      apikey: _config.get(EConfiguration.SENDGRID_API_KEY),
    }),
  }),
  GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    debug: false,
    playground: true,
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    sortSchema: true,
    introspection: true,
    installSubscriptionHandlers: true,
    context: (options) => {
      const { req } = options
      return { req }
    },
  }),
  AuthModule,
]

export const baseProviders = [
  {
    provide: APP_GUARD,
    useClass: GqlAuthGuard,
  },
]
