import {
  isGraphQLNonNull,
  isGraphQLList,
  isGraphQLScalarType,
  getDeepKeys
} from './CommonUtils';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';

const { json2ts } = require('json-ts');

const prettier = require('prettier/standalone');
const prettierBabylon = require('prettier/parser-babylon');
const prettierGraphql = require('prettier/parser-graphql');
const prettierTS = require('prettier/parser-typescript');
const scalarToTypescript = {
  Int: 0,
  Float: 0.0,
  String: 'String',
  Boolean: true,
  ID: 'String',
  Date: 'String',
  Email: 'String'
};

function getArgs(schema: any): string {
  const args: any[] = schema.args;
  if (args && args.length) {
    let rs = args
      .map(arg => {
        const { type } = arg;
        let str = '';
        if (type) {
          str = `$${arg.name}: ${type.ofType ? type.ofType : type.name}`;
          if (isGraphQLNonNull(arg.type)) {
            str += '!';
          }
        }
        return str;
      })
      .join(`\n`);
    return rs ? `(${rs})` : rs;
  }
  return '';
}

function getParams(schema: any): string {
  const args: any[] = schema.args;
  if (args && args.length) {
    let rs = args.map(arg => `${arg.name}: $${arg.name}`).join(`\n`);
    return rs ? `(${rs})` : rs;
  }
  return '';
}

function getFields(schema: any) {
  const { type } = schema;
  if (!type) {
    return null;
  }
  if (isGraphQLList(type) && isGraphQLScalarType(type.ofType)) {
    return type.ofType['_fields'];
  }
  return type['_fields'];
}

function getSchemaName(schema: any) {
  const { type } = schema;
  if (!type) {
    return null;
  }
  if (isGraphQLList(type) && isGraphQLScalarType(type.ofType)) {
    return type.ofType['name'];
  }
  return type['name'];
}

function getResponseObj(
  schema: any,
  deepKeys: any[] = [],
  parentIndex?: any
): object {
  const keys = Object.keys(schema);
  const obj = {};
  try {
    keys.forEach(key => {
      const name = schema[key].name;
      const fields = getFields(schema[key]);

      const schemaName = getSchemaName(schema[key]);

      if (!fields) {
        let value = scalarToTypescript[schema[key].type.name];
        obj[name] = value || 'String';
      } else {
        const isAddedBefore = deepKeys.find(
          k => k.schemaName === schemaName && k.parentIndex !== parentIndex
        );
        if (!isAddedBefore) {
          const index = (parentIndex || 0) + 1;
          deepKeys.push({
            schemaName,
            parentIndex: parentIndex || 0,
            index
          });

          obj[name] = getResponseObj(fields, deepKeys, index);
        }
      }
    });
    return obj;
  } catch (error) {
    return {};
  }
}

function prettifyGraphQL(str: string) {
  return prettier.format(str, {
    parser: 'babel',
    printWidth: 40,
    plugins: [prettierBabylon, prettierGraphql]
  });
}

function prettifyTS(str: string) {
  return prettier.format(str, {
    parser: 'typescript',
    printWidth: 40,
    plugins: [prettierTS]
  });
}

export function GetAllTemplates(
  schemaType: string,
  schema: any
): { graphql: string; typescript: string } {
  const schemaName = schema.name;
  const args = getArgs(schema);
  const params = getParams(schema);
  const fields = getFields(schema);
  let obj = {},
    jsonQuery = '';

  if (fields) {
    obj = getResponseObj(fields);
    jsonQuery = `{ ${jsonToGraphQLQuery(obj)} }`;
  }

  const graphlStr = `
    const ${schemaName} = gql\`
      ${schemaType} ${schemaName}
        ${args} {
          ${schemaName}
          ${params}
          ${jsonQuery}
      }
      \`
    `;
  const graphql = prettifyGraphQL(graphlStr);

  const typescriptStr = json2ts(JSON.stringify(obj));
  const typescript = prettifyTS(typescriptStr);

  return {
    graphql,
    typescript
  };
}
