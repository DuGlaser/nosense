import { CursorNodeComponent, StatementWrapper } from '@editor/components';
import { CompleteOption } from '@editor/hooks/useCompleteMenu';
import {
  useDeleteStatement,
  useInsertStatement,
  useStatement,
} from '@editor/store';
import { styled } from '@mui/material';
import { useRef } from 'react';

import {
  createAssignStatement,
  createExpressionStatement,
  createIfStatementEnd,
  createIfStatementStart,
  createLetStatement,
  createNewStatement,
  createWhileStatementEnd,
  createWhileStatementStart,
  CursorNode,
} from '@/lib/models/editorObject';

const Placeholder = styled('div')({
  opacity: 0.5,
});

export const NewStatementComponent: React.FC<{ id: CursorNode['id'] }> = ({
  id,
}) => {
  const insertStmt = useInsertStatement();
  const deleteStmt = useDeleteStatement();
  const statement = useStatement(id);
  const [cursor] = statement.nodes;

  const ref = useRef<HTMLDivElement>(null);

  const options: CompleteOption[] = [
    {
      displayName: '変数宣言',
      keyword: [],
      onComplete: () => {
        insertStmt(id, [createLetStatement({ type: '', varNames: [''] })]);
        deleteStmt(id);
      },
    },
    {
      displayName: '代入文',
      keyword: [],
      onComplete: () => {
        insertStmt(id, [
          createAssignStatement({
            name: '',
            value: '',
            indent: statement.indent,
          }),
        ]);
        deleteStmt(id);
      },
    },
    {
      displayName: 'if文',
      keyword: [],
      onComplete: () => {
        insertStmt(id, [
          createIfStatementStart({ condition: '', indent: statement.indent }),
          createNewStatement({ indent: statement.indent + 1 }),
          createIfStatementEnd({ indent: statement.indent }),
        ]);
        deleteStmt(id);
      },
    },
    {
      displayName: 'while文',
      keyword: [],
      onComplete: () => {
        insertStmt(id, [
          createWhileStatementStart({
            condition: '',
            indent: statement.indent,
          }),
          createNewStatement({ indent: statement.indent + 1 }),
          createWhileStatementEnd({ indent: statement.indent }),
        ]);
        deleteStmt(id);
      },
    },
    {
      displayName: '関数呼び出し',
      keyword: [],
      onComplete: () => {
        insertStmt(id, [
          createExpressionStatement({ exp: '', indent: statement.indent }),
        ]);
        deleteStmt(id);
      },
    },
  ];

  return (
    <StatementWrapper indent={statement.indent}>
      <CursorNodeComponent
        ref={ref}
        id={cursor}
        completeOptions={options}
        onKeyDown={(e) => {
          e.preventDefault();
        }}
        onInput={(e) => {
          e.preventDefault();
        }}
      />
      <Placeholder onClick={() => ref.current?.focus()}>
        追加したい文を選択してください
      </Placeholder>
    </StatementWrapper>
  );
};
