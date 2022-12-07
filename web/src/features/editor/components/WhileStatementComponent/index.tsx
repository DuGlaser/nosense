import {
  BaseTextComopnent,
  CursorNodeComponent,
  EditableNodeComponent,
  StatementWrapper,
} from '@editor/components';
import { useNewStatementInputEvent } from '@editor/hooks/useNewStatementInputEvent';
import { useStatement } from '@editor/store';

import {
  WhileStatementEnd,
  WhileStatementStart,
} from '@/lib/models/editorObject';

export const WhileStatementStartComponent: React.FC<{
  id: WhileStatementStart['id'];
}> = ({ id }) => {
  const statement = useStatement<WhileStatementStart>(id);
  const newStatementInputEvent = useNewStatementInputEvent(
    statement.id,
    statement.indent + 1
  );
  const [cursor, conditionExp, endCursor] = statement.nodes;

  return (
    <StatementWrapper indent={statement.indent}>
      <CursorNodeComponent id={cursor} />
      <BaseTextComopnent>while (</BaseTextComopnent>
      <EditableNodeComponent id={conditionExp} />
      <BaseTextComopnent>)</BaseTextComopnent>
      <CursorNodeComponent id={endCursor} inputEvent={newStatementInputEvent} />
    </StatementWrapper>
  );
};

export const WhileStatementEndComponent: React.FC<{
  id: WhileStatementEnd['id'];
}> = ({ id }) => {
  const statement = useStatement<WhileStatementEnd>(id);
  const newStatementInputEvent = useNewStatementInputEvent(
    statement.id,
    statement.indent
  );
  const [cursor] = statement.nodes;

  return (
    <StatementWrapper indent={statement.indent}>
      <BaseTextComopnent>endwhile</BaseTextComopnent>
      <CursorNodeComponent id={cursor} inputEvent={newStatementInputEvent} />
    </StatementWrapper>
  );
};
