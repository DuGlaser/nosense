import { InputEvent } from '@editor/components';
import { Statement } from '@editor/lib';
import { useDeleteStatement, useMovePrevStatement } from '@editor/store';
import { useCallback, useMemo } from 'react';

export const useDeleteStatementInputEvent = (
  ids: Statement['id'][]
): InputEvent[] => {
  const deleteStmt = useDeleteStatement();
  const movePrevStmt = useMovePrevStatement();

  const deleteStmts = useCallback(() => {
    if (ids.length === 0) return;
    movePrevStmt(ids[0]);

    ids.forEach(deleteStmt);
  }, [deleteStmt, ids]);

  return useMemo(
    () => [
      {
        key: 'Backspace',
        callback: (e, next) => {
          if (!e.ctrlKey) return next();

          deleteStmts();
        },
      },
    ],
    [deleteStmts]
  );
};
