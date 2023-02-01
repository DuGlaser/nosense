import { useInsertStatement } from '@editor/store';
import { InputEvent } from '@editor/type';

import { createNewStatement } from '@/lib/models/editorObject';

export const useNextNewStatementInputEvent = (
  id: string,
  indent: number
): InputEvent[] => {
  const { insertNextStatement } = useInsertStatement();

  return [
    {
      key: 'Enter',
      contentLength: 0,
      callback: () => {
        insertNextStatement(id, [createNewStatement({ indent })]);
      },
    },
    {
      key: 'Enter',
      cursorPosition: 'END',
      callback: () => {
        insertNextStatement(id, [createNewStatement({ indent })]);
      },
    },
  ];
};

export const usePrevNewStatementInputEvent = (
  id: string,
  indent: number
): InputEvent[] => {
  const { insertPrevStatement } = useInsertStatement();

  return [
    {
      key: 'Enter',
      contentLength: 0,
      callback: () => {
        insertPrevStatement(id, [createNewStatement({ indent })]);
      },
    },
    {
      key: 'Enter',
      cursorPosition: 'START',
      callback: () => {
        insertPrevStatement(id, [createNewStatement({ indent })]);
      },
    },
  ];
};
