import {
  BaseTextComopnent,
  CursorNodeComponent,
  EditableNodeComponent,
  StatementWrapper,
} from '@editor/components';
import { useNewStatementInputEvent } from '@editor/hooks/useNewStatementInputEvent';
import { useStatement } from '@editor/store';

import {
  IfStatementElse,
  IfStatementEnd,
  IfStatementStart,
} from '@/lib/models/editorObject';

export const IfStatementStartComponent: React.FC<{
  id: IfStatementStart['id'];
}> = ({ id }) => {
  const statement = useStatement<IfStatementStart>(id);
  const newStatementInputEvent = useNewStatementInputEvent(
    statement.id,
    statement.indent + 1
  );
  const [cursor, conditionExp, endCursor] = statement.nodes;

  return (
    <StatementWrapper indent={statement.indent}>
      <CursorNodeComponent id={cursor} />
      <BaseTextComopnent>if (</BaseTextComopnent>
      <EditableNodeComponent id={conditionExp} />
      <BaseTextComopnent>)</BaseTextComopnent>
      <CursorNodeComponent id={endCursor} inputEvent={newStatementInputEvent} />
    </StatementWrapper>
  );
};

export const IfStatementElseComponent: React.FC<{
  id: IfStatementElse['id'];
}> = ({ id }) => {
  const statement = useStatement<IfStatementElse>(id);
  const newStatementInputEvent = useNewStatementInputEvent(
    statement.id,
    statement.indent + 1
  );
  const [cursor] = statement.nodes;

  return (
    <StatementWrapper indent={statement.indent}>
      <BaseTextComopnent>else</BaseTextComopnent>
      <CursorNodeComponent id={cursor} inputEvent={newStatementInputEvent} />
    </StatementWrapper>
  );
};

export const IfStatementEndComponent: React.FC<{
  id: IfStatementEnd['id'];
}> = ({ id }) => {
  const statement = useStatement<IfStatementEnd>(id);
  const newStatementInputEvent = useNewStatementInputEvent(
    statement.id,
    statement.indent
  );
  const [cursor] = statement.nodes;

  return (
    <StatementWrapper indent={statement.indent}>
      <BaseTextComopnent>endif</BaseTextComopnent>
      <CursorNodeComponent id={cursor} inputEvent={newStatementInputEvent} />
    </StatementWrapper>
  );
};
