import React, { Component } from 'react';
import { introspectSchema } from 'graphql-tools';
import { HttpLink } from 'apollo-link-http';
import Split from 'react-split';

import './App.scss';
import { Input } from './components/Input';
import { ThemeProvider } from './theme/styled-components';
import { ThemeDefault } from './theme/theme';
import { ButtonPrimary } from './components/Button';
import { isValidUri } from './utils/CommonUtils';
import { GetSchemaTemplate, GetTypescript } from './utils/TemplateBuilder';
import { History } from './components/History';
import { SchemaList } from './components/SchemaList';
import { Header } from './components/Header';
import { Wrapper, Column } from './components/Wrapper';
import { Form } from './components/Form';
import { CodeMirror } from './components/CodeMirror';

class App extends Component {
  state = {
    uri: '',
    schema: null,
    queries: [],
    mutations: [],
    histories: [],
    schemaTemplate: '',
    typescript: '',
    schemaSelected: null,
    schemaType: null
  };

  componentDidMount() {
    const histories = localStorage.getItem('HISTORY');
    if (histories) {
      this.setState({ histories: JSON.parse(histories) });
    }
  }

  showLinkError() {
    alert('Link is invalid');
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
    this.setState({ uri });
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
          mutations
        });
      } else {
        this.showLinkError();
      }
    } catch (error) {
      this.showLinkError();
    }
  }

  _renderResult() {
    const { schemaTemplate, typescript } = this.state;
    return (
      <Split
        style={{ display: 'flex', flexDirection: 'column' }}
        direction="vertical"
        sizes={[50, 50]}
      >
        <div>
          <h1>GraphQL</h1>
          <CodeMirror value={schemaTemplate} />
        </div>
        <div>
          <h1>Typescript</h1>
          <CodeMirror value={typescript} />
        </div>
      </Split>
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
        className="form"
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
    const { queries, mutations } = this.state;

    return (
      <SchemaList
        queries={queries}
        mutations={mutations}
        onSelect={(schemaType: string, schemaSelected: any) =>
          this.setState({ schemaType, schemaSelected }, () => {
            const schemaTemplate = GetSchemaTemplate(
              schemaType,
              schemaSelected
            );
            const typescript = GetTypescript(schemaSelected);
            console.log(typescript);
            this.setState({ schemaTemplate, typescript });
          })
        }
      />
    );
  }

  render() {
    return (
      <ThemeProvider theme={ThemeDefault}>
        <>
          <Header />

          <Wrapper>
            <Split
              style={{ display: 'flex', flexDirection: 'row', height: '100%' }}
              direction="horizontal"
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
