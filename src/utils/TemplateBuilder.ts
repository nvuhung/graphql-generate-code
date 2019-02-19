import {
  isGraphQLNonNull,
  isGraphQLList,
  isGraphQLScalarType
} from './CommonUtils';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import { object } from 'prop-types';

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

function getResponseObj(schema: any): object {
  const keys = Object.keys(schema);
  const obj = {};
  try {
    keys.forEach(key => {
      const name = schema[key].name;
      const fields = getFields(schema[key]);
      if (!fields) {
        let value = scalarToTypescript[schema[key].type.name];
        obj[name] = value || 'String';
      } else {
        obj[name] = getResponseObj(fields);
      }
    });
    return obj;
  } catch (error) {
    return {};
  }
}

function getResponse(schema: any): string {
  try {
    const fields = getFields(schema);
    if (fields) {
      const obj = getResponseObj(fields);
      const jsonQuery = jsonToGraphQLQuery(obj);
      return `{ ${jsonQuery} }`;
    }
    return '';
  } catch (error) {
    return '';
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

export function GetSchemaTemplate(schemaType: string, schema: any): string {
  const schemaName = schema.name;
  const args = getArgs(schema);
  const params = getParams(schema);
  const response = getResponse(schema);

  let template = `
    const ${schemaName} = { ${schemaName}: gql\`
      ${schemaType} ${schemaName}
        ${args} {
          ${schemaName}
          ${params}
          ${response}
      }
      \`
  }`;

  return prettifyGraphQL(template);
}

export function GetTypescript(schema: any): string {
  const fields = getFields(schema);
  if (fields) {
    const obj = getResponseObj(fields);
    const typescriptStr = json2ts(JSON.stringify(obj));
    return prettifyTS(typescriptStr);
  }
  return '';
}
