import {
  CursorNodeComponent,
  EditableNodeComponent,
  StatementWrapper,
} from '@editor/components';
import { useStatement } from '@editor/store';

import {
  WhileStatementEnd,
  WhileStatementStart,
} from '@/lib/models/editorObject';

export const WhileStatementStartComponent: React.FC<{
  id: WhileStatementStart['id'];
}> = ({ id }) => {
  const statement = useStatement(id);
  const [cursor, conditionExp] = statement.nodes;

  return (
    <StatementWrapper indent={statement.indent}>
      <CursorNodeComponent id={cursor} />
      <span>while (</span>
      <EditableNodeComponent id={conditionExp} />
      <span>)</span>
    </StatementWrapper>
  );
};

export const WhileStatementEndComponent: React.FC<{
  id: WhileStatementEnd['id'];
}> = ({ id }) => {
  const statement = useStatement(id);
  const [cursor] = statement.nodes;

  return (
    <StatementWrapper indent={statement.indent} needFrontSpace={true}>
      <div>endwhile</div>
      <CursorNodeComponent id={cursor} />
    </StatementWrapper>
  );
};
