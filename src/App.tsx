import React, { Component } from 'react';
import { introspectSchema } from 'graphql-tools';
import { HttpLink } from 'apollo-link-http';
import Split from 'react-split';

import './App.scss';
import { Input } from './components/Input';
import { ThemeProvider } from './theme/styled-components';
import { ThemeDefault } from './theme/theme';
import { ButtonPrimary } from './components/Button';
import { isValidUri, filterSchema } from './utils/CommonUtils';
import { History } from './components/History';
import { SchemaList } from './components/SchemaList';
import { Header } from './components/Header';
import {
  Wrapper,
  Column,
  SchemaHeader,
  SchemaContainer
} from './components/Wrapper';
import { Form } from './components/Form';
import { CodeMirror } from './components/CodeMirror';
import { GetAllTemplates } from './utils/TemplateBuilder';
import { Loader } from './components/Loader';

class App extends Component {
  state = {
    uri: '',
    schema: null,
    queries: [],
    mutations: [],
    histories: [],
    graphql: '',
    typescript: '',
    schemaSelected: null,
    schemaType: null,
    textSearchSchema: '',
    isLoading: false
  };

  componentDidMount() {
    const histories = localStorage.getItem('HISTORY');
    if (histories) {
      this.setState({ histories: JSON.parse(histories) });
    }
  }

  showLinkError() {
    this.setState(
      {
        isLoading: false
      },
      () => {
        alert('Link is invalid');
      }
    );
  }

  updateHistory(histories: string[]) {
    this.setState({ histories });
    localStorage.setItem('HISTORY', JSON.stringify(histories));
  }

  addHistory(uri: string) {
    const histories: string[] = this.state.histories;
    if (!histories.includes(uri)) {
      histories.unshift(uri);
      this.updateHistory(histories);
    }
  }

  removeHistory(uri: string) {
    const histories: string[] = this.state.histories;
    const index = histories.findIndex(h => h === uri);
    if (index > -1) {
      histories.splice(index, 1);
      this.updateHistory(histories);
    }
  }

  async handleSubmit(uri: string) {
    if (!isValidUri(uri)) {
      this.showLinkError();
      return;
    }
    this.setState({ uri, isLoading: true });
    const link = new HttpLink({
      uri,
      fetch
    });
    try {
      const schema = await introspectSchema(link);
      let queries, mutations;
      const queriesObj = schema.getQueryType();
      const mutationsObj = schema.getMutationType();
      if (queriesObj || mutationsObj) {
        this.addHistory(uri);

        if (queriesObj) {
          const fields = queriesObj.getFields();
          queries = Object.keys(fields).map(v => ({
            ...fields[v]
          }));
        }
        if (mutationsObj) {
          const fields = mutationsObj.getFields();
          mutations = Object.keys(fields).map(v => ({
            ...fields[v]
          }));
        }

        this.setState({
          schema,
          queries,
          mutations,
          isLoading: false
        });
      } else {
        this.showLinkError();
      }
    } catch (error) {
      this.showLinkError();
    }
  }

  _renderResult() {
    const { graphql, typescript } = this.state;
    return (
      <div style={{ height: '100%' }}>
        <SchemaContainer>
          <SchemaHeader>GraphQL</SchemaHeader>
          <CodeMirror value={graphql} />
        </SchemaContainer>

        <SchemaContainer>
          <SchemaHeader>Typescript</SchemaHeader>
          <CodeMirror value={typescript} />
        </SchemaContainer>
      </div>
    );
  }

  _renderHistory() {
    const { histories, uri } = this.state;

    return (
      <History
        histories={histories}
        uri={uri}
        onSelect={(history: string) => this.handleSubmit(history)}
        onRemove={(history: string) => this.removeHistory(history)}
      />
    );
  }

  _renderForm() {
    const { uri } = this.state;

    return (
      <Form
        onSubmit={event => {
          event.preventDefault();
          this.handleSubmit(uri);
        }}
      >
        <Input
          placeholder="GraphQL URL..."
          value={uri}
          onChange={event => this.setState({ uri: event.target.value })}
        />
        <ButtonPrimary type="submit" value="Submit" />
      </Form>
    );
  }

  _renderSchema() {
    const {
      queries,
      mutations,
      textSearchSchema,
      schemaSelected,
      schemaType
    } = this.state;

    const queriesFiltered = filterSchema(queries, textSearchSchema);
    const mutationsFiltered = filterSchema(mutations, textSearchSchema);

    return (
      <>
        <div style={{ padding: 10, display: 'flex' }}>
          <Input
            placeholder="Search schema..."
            value={textSearchSchema}
            onChange={event =>
              this.setState({ textSearchSchema: event.target.value })
            }
          />
        </div>

        <SchemaList
          schemaNameSelected={(schemaSelected && schemaSelected['name']) || ''}
          schemaType={schemaType || ''}
          queries={queriesFiltered}
          mutations={mutationsFiltered}
          onSelect={(schemaType: string, schemaSelected: any) =>
            this.setState({ schemaType, schemaSelected }, () => {
              const { graphql, typescript } = GetAllTemplates(
                schemaType,
                schemaSelected
              );
              this.setState({ graphql, typescript });
            })
          }
        />
      </>
    );
  }

  render() {
    return (
      <ThemeProvider theme={ThemeDefault}>
        <>
          {this.state.isLoading && <Loader />}

          <Header />

          <Wrapper>
            <Split
              style={{ display: 'flex', flexDirection: 'row', height: '100%' }}
              direction="horizontal"
              minSize={320}
              sizes={[33, 33, 34]}
            >
              <Column>
                {this._renderForm()}

                {this._renderHistory()}
              </Column>

              <Column>{this._renderSchema()}</Column>

              <Column>{this._renderResult()}</Column>
            </Split>
          </Wrapper>
        </>
      </ThemeProvider>
    );
  }
}

export default App;
