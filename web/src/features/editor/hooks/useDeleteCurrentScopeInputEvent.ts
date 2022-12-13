import { InputEvent } from '@editor/components';
import { Statement } from '@editor/lib';
import {
  useDeleteStatement,
  useGetCurrentScope,
  useMovePrevStatement,
} from '@editor/store';
import { useCallback, useMemo } from 'react';

export const useDeleteCurrentScopeInputEvent = (
  id: Statement['id']
): InputEvent[] => {
  const getCurrentScopeIds = useGetCurrentScope();
  const deleteStmt = useDeleteStatement();
  const movePrevStmt = useMovePrevStatement();

  const deleteCurrentScope = useCallback(async () => {
    const ids = await getCurrentScopeIds(id);
    movePrevStmt(ids[0]);

    ids.forEach(deleteStmt);
  }, [deleteStmt, id]);

  return useMemo(
    () => [
      {
        key: 'Backspace',
        callback: (e, next) => {
          if (!e.ctrlKey) return next();

          deleteCurrentScope();
        },
      },
    ],
    [deleteCurrentScope]
  );
};
