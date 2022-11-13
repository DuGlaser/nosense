import {
  CompleteOption,
  CursorNodeComponent,
  StatementWrapper,
} from '@editor/components';
import {
  useDeleteStatement,
  useInsertStatement,
  useStatement,
} from '@editor/store';
import { styled } from '@mui/material';

import { createLetStatement, CursorNode } from '@/lib/models/editorObject';

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

  const options: CompleteOption[] = [
    {
      displayName: '代入文',
      keyword: [],
      onComplete: () => {
        insertStmt(id, [createLetStatement({ type: '', varNames: [''] })]);
        deleteStmt(id);
      },
    },
    {
      displayName: '条件文',
      keyword: [],
      onComplete: () => {
        deleteStmt(id);
      },
    },
  ];

  return (
    <StatementWrapper indent={statement.indent} needFrontSpace={false}>
      <CursorNodeComponent
        id={cursor}
        completeOptions={options}
        onKeyDown={(e) => {
          e.preventDefault();
        }}
        onInput={(e) => {
          e.preventDefault();
        }}
      />
      <Placeholder>追加したい文を選択してください</Placeholder>
    </StatementWrapper>
  );
};
