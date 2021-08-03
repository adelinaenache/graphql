import { IResolverValidationOptions } from '@graphql-tools/utils';
import { Type } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Config, GraphQLExecutor } from 'apollo-server-core';
import { GraphQLSchema } from 'graphql';
import { DefinitionsGeneratorOptions } from '../graphql-ast.explorer';
import { BuildSchemaOptions } from './build-schema-options.interface';
import { ServerOptions } from 'graphql-ws';

export interface ServerRegistration {
  path?: string;
  cors?: any | boolean;
  bodyParserConfig?: any | boolean;
  onHealthCheck?: (req: any) => Promise<any>;
  disableHealthCheck?: boolean;
}

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export type GraphQLWsSubscriptionsConfig = Partial<
  Pick<
    ServerOptions,
    | 'connectionInitWaitTimeout'
    | 'onConnect'
    | 'onDisconnect'
    | 'onClose'
    | 'onSubscribe'
    | 'onNext'
  >
>;

export type SubscriptionConfig = {
  'graphql-ws'?: GraphQLWsSubscriptionsConfig;
};

export type Enhancer = 'guards' | 'interceptors' | 'filters';
export interface GqlModuleOptions
  extends Omit<Config, 'typeDefs' | 'subscriptions'>,
    Partial<
      Pick<
        ServerRegistration,
        | 'onHealthCheck'
        | 'disableHealthCheck'
        | 'path'
        | 'cors'
        | 'bodyParserConfig'
      >
    > {
  typeDefs?: string | string[];
  typePaths?: string[];
  include?: Function[];
  executorFactory?: (
    schema: GraphQLSchema,
  ) => GraphQLExecutor | Promise<GraphQLExecutor>;
  installSubscriptionHandlers?: boolean;
  resolverValidationOptions?: IResolverValidationOptions;
  directiveResolvers?: any;
  schemaDirectives?: Record<string, any>;
  playground?: boolean;
  subscriptions?: SubscriptionConfig;
  transformSchema?: (
    schema: GraphQLSchema,
  ) => GraphQLSchema | Promise<GraphQLSchema>;
  definitions?: {
    path?: string;
    outputAs?: 'class' | 'interface';
  } & DefinitionsGeneratorOptions;
  autoSchemaFile?: string | boolean;
  buildSchemaOptions?: BuildSchemaOptions;
  /**
   * Prepends the global prefix to the url
   *
   * @see [faq/global-prefix](Global Prefix)
   */
  useGlobalPrefix?: boolean;
  /**
   * Enable/disable enhancers for @ResolveField()
   */
  fieldResolverEnhancers?: Enhancer[];
  /**
   * Sort the schema lexicographically
   */
  sortSchema?: boolean;
  /**
   * Apply `transformSchema` to the `autoSchemaFile`
   */
  transformAutoSchemaFile?: boolean;
  /**
   * If enabled, will register a global interceptor that automatically maps
   * "HttpException" class instances to corresponding Apollo errors.
   * @default true
   */
  autoTransformHttpErrors?: boolean;
}

export interface GqlOptionsFactory {
  createGqlOptions(): Promise<GqlModuleOptions> | GqlModuleOptions;
}

export interface GqlModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<GqlOptionsFactory>;
  useClass?: Type<GqlOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<GqlModuleOptions> | GqlModuleOptions;
  inject?: any[];
}
