import {
  BaseTextComopnent,
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
      <BaseTextComopnent>while (</BaseTextComopnent>
      <EditableNodeComponent id={conditionExp} />
      <BaseTextComopnent>)</BaseTextComopnent>
    </StatementWrapper>
  );
};

export const WhileStatementEndComponent: React.FC<{
  id: WhileStatementEnd['id'];
}> = ({ id }) => {
  const statement = useStatement(id);
  const [cursor] = statement.nodes;

  return (
    <StatementWrapper indent={statement.indent}>
      <BaseTextComopnent>endwhile</BaseTextComopnent>
      <CursorNodeComponent id={cursor} />
    </StatementWrapper>
  );
};
