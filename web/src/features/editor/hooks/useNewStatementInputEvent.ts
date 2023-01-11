import { useInsertStatement } from '@editor/store';
import { InputEvent } from '@editor/type';

import { createNewStatement } from '@/lib/models/editorObject';

export const useNewStatementInputEvent = (
  id: string,
  indent: number
): InputEvent[] => {
  const insertStmt = useInsertStatement();

  return [
    {
      key: 'Enter',
      contentLength: 0,
      callback: () => {
        insertStmt(id, [createNewStatement({ indent })]);
      },
    },
    {
      key: 'Enter',
      cursorPosition: 'END',
      callback: () => {
        insertStmt(id, [createNewStatement({ indent })]);
      },
    },
  ];
};
