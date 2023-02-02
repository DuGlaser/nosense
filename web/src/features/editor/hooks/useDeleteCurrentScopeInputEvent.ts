import { Statement } from '@editor/lib';
import {
  useDeleteStatement,
  useGetCurrentScope,
  useMovePrevStatement,
} from '@editor/store';
import { InputEvent } from '@editor/type';
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

  return useMemo<InputEvent[]>(
    () => [
      {
        key: 'Backspace',
        ctrlKey: true,
        callback: () => {
          deleteCurrentScope();
        },
      },
    ],
    [deleteCurrentScope]
  );
};
