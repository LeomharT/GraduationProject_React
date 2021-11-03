import { Editor, EditorCommand, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';

@observer
export default class MyEditor extends Component<{}, {}>
{
    @observable editorState: EditorState = EditorState.createEmpty();
    onEditorChange = (editorState: EditorState) => this.editorState = editorState;
    handleKeyCommand = (command: EditorCommand, newState: EditorState) =>
    {
        console.log(command);
        if (newState)
        {
            this.onEditorChange(newState);
            return 'handled';
        }
        return 'not-handled';
    };
    componentDidMount()
    {
        console.log(this.editorState);
    }
    render()
    {
        return (
            <Editor editorState={this.editorState} onChange={this.onEditorChange} handleKeyCommand={this.handleKeyCommand}>

            </Editor>
        );
    }
}
