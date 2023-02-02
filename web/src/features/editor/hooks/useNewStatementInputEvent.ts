import { useInsertStatement } from '@editor/store';
import { InputEvent } from '@editor/type';
import { useMemo } from 'react';

import { createNewStatement } from '@/lib/models/editorObject';

export const useNewStatementInputEvent = (
  id: string,
  indents: {
    nextIndent: number;
    prevIndent: number;
  }
): InputEvent[] => {
  const { insertNextStatement, insertPrevStatement } = useInsertStatement();

  return useMemo<InputEvent[]>(
    () => [
      {
        key: 'Enter',
        ctrlKey: true,
        callback: () => {
          insertNextStatement(id, [
            createNewStatement({ indent: indents.nextIndent }),
          ]);
        },
      },
      {
        key: 'Enter',
        ctrlKey: true,
        shiftKey: true,
        callback: () => {
          insertPrevStatement(id, [
            createNewStatement({ indent: indents.prevIndent }),
          ]);
        },
      },
    ],
    [insertNextStatement, insertPrevStatement]
  );
};
