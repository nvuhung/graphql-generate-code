import React from 'react';

export class CodeMirror extends React.Component<{ value: string }> {
  elementRef: any;
  editor: any;
  cachedValue: string;

  constructor(props: any) {
    super(props);
    this.cachedValue = props.value || '';
  }

  componentDidMount() {
    const CodeMirror = require('codemirror');
    require('codemirror/mode/javascript/javascript');
    const { value } = this.props;

    this.editor = CodeMirror(this.elementRef, {
      mode: 'javascript',
      theme: 'default',
      lineNumbers: true,
      readOnly: true,
      value
    });
  }

  componentDidUpdate(prevProps: any) {
    if (
      this.props.value !== prevProps.value &&
      this.props.value !== this.cachedValue
    ) {
      const thisValue = this.props.value || '';
      this.cachedValue = thisValue;
      this.editor.setValue(thisValue);
    }
  }

  render() {
    return (
      <div
        style={{ height: 'calc(100% - 38px)' }}
        ref={elementRef => (this.elementRef = elementRef)}
      />
    );
  }
}
