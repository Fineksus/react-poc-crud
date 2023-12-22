// ** React Imports
import { useEffect, useMemo, useRef, useState } from 'react'

// ** Third Party Imports
import { ContentState, EditorState, convertFromHTML } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'

// ** Component Import
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'


const DraftEditorControlled = ({ onEditorChange, defaultValue }) => {
  const [editorState, setEditorState] = useState()
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    if (defaultValue && initialLoad) {
      const contentState = ContentState.createFromBlockArray(
        convertFromHTML(defaultValue)
      )

      const state = EditorState.createWithContent(contentState);
      setEditorState(state)
      setInitialLoad(false)
    }
  }, [defaultValue]);

  const onEditorStateChange = (newEditorState) => {
    const contentState = newEditorState.getCurrentContent()
    const html = stateToHTML(contentState)
    setEditorState(newEditorState)
    onEditorChange(html)
  }

  return <ReactDraftWysiwyg editorState={editorState} onEditorStateChange={onEditorStateChange} />
}

export default DraftEditorControlled
