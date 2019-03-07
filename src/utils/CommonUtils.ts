import { GraphQLNonNull, GraphQLList, GraphQLScalarType } from 'graphql';

export const isGraphQLNonNull = (object: any): object is GraphQLNonNull<any> =>
  'ofType' in object;

export const isGraphQLList = (object: any): object is GraphQLList<any> =>
  'ofType' in object;

export const isGraphQLScalarType = (object: any): object is GraphQLScalarType =>
  'name' in object;

export const isValidUri = (url: string): boolean =>
  !!url && url.includes('http') && url.includes('/graphql');

export const filterSchema = (schemas: any[] = [], textSearch: string = '') =>
  schemas.filter(item =>
    item.name.toLowerCase().includes(textSearch.toLowerCase())
  );

export const getDeepKeys = obj => {
  let keys: string[] = [];
  for (var key in obj) {
    keys.push(key);
    if (typeof obj[key] === 'object') {
      const subkeys = getDeepKeys(obj[key]);
      keys = keys.concat(
        subkeys.map(function(subkey) {
          return key + '.' + subkey;
        })
      );
    }
  }
  return keys;
};
