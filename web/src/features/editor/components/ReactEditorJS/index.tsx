import { LetStatementElement } from '@editor/elements';
import { LetStatementPlugin } from '@editor/plugins';
import EditorJS from '@editorjs/editorjs';
import { styled } from '@mui/material';
import { useEffect, useId, useRef } from 'react';

const classFormat = (className: string) => {
  return `.${className}`;
};

const multiClassFormat = (classNames: string[]) => {
  return classNames.map((name) => classFormat(name)).join(',');
};

const EditorContent = styled('div')(() => ({
  width: '100%',
  height: '100%',

  '.ce-block__content, .ce-toolbar__content': {
    maxWidth: 'none',
  },

  [classFormat(LetStatementElement.rootElementClassName)]: {
    display: 'flex',
    gap: '4px',

    [multiClassFormat([
      LetStatementElement.nameElementClassName,
      LetStatementElement.typeElementClassName,
    ])]: {
      outline: 'none',
    },

    [classFormat(LetStatementElement.nameElementClassName)]: {
      color: '#F2CB44',
    },
  },
}));

export const ReactEditorJS = () => {
  const id = useId();

  const editorJS = useRef<EditorJS>();

  useEffect(() => {
    editorJS.current = new EditorJS({
      holder: id,
      tools: {
        letStatement: LetStatementPlugin,
      },
    });
  }, []);

  return <EditorContent id={id} />;
};
