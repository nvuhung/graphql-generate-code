import { GraphQLNonNull, GraphQLList, GraphQLScalarType } from 'graphql';

export const isGraphQLNonNull = (object: any): object is GraphQLNonNull<any> =>
  'ofType' in object;

export const isGraphQLList = (object: any): object is GraphQLList<any> =>
  'ofType' in object;

export const isGraphQLScalarType = (object: any): object is GraphQLScalarType =>
  'name' in object;

export const isValidUri = (url: string): boolean =>
  !!url && url.includes('http') && url.includes('/graphql');
