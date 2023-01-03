import {
  BaseTextComopnent,
  CursorNodeComponent,
  EditableNodeComponent,
  StatementWrapper,
} from '@editor/components';
import {
  useDeleteCurrentScopeInputEvent,
  useNewStatementInputEvent,
} from '@editor/hooks';
import { useStatement } from '@editor/store';
import { StatementComponentProps } from '@editor/type';

import {
  IfStatementElse,
  IfStatementEnd,
  IfStatementStart,
} from '@/lib/models/editorObject';

export const IfStatementStartComponent: React.FC<StatementComponentProps> = ({
  id,
  active,
}) => {
  const statement = useStatement<IfStatementStart>(id);
  const newStatementInputEvent = useNewStatementInputEvent(
    statement.id,
    statement.indent + 1
  );
  const deleteCurrentScopeInputEvent = useDeleteCurrentScopeInputEvent(
    statement.id
  );
  const [cursor, conditionExp, endCursor] = statement.nodes;

  return (
    <StatementWrapper indent={statement.indent} active={active}>
      <CursorNodeComponent
        id={cursor}
        inputEvent={deleteCurrentScopeInputEvent}
      />
      <BaseTextComopnent>if (</BaseTextComopnent>
      <EditableNodeComponent id={conditionExp} />
      <BaseTextComopnent>)</BaseTextComopnent>
      <CursorNodeComponent
        id={endCursor}
        inputEvent={[
          ...newStatementInputEvent,
          ...deleteCurrentScopeInputEvent,
        ]}
      />
    </StatementWrapper>
  );
};

export const IfStatementElseComponent: React.FC<StatementComponentProps> = ({
  id,
  active,
}) => {
  const statement = useStatement<IfStatementElse>(id);
  const newStatementInputEvent = useNewStatementInputEvent(
    statement.id,
    statement.indent + 1
  );
  const [cursor] = statement.nodes;

  return (
    <StatementWrapper indent={statement.indent} active={active}>
      <BaseTextComopnent>else</BaseTextComopnent>
      <CursorNodeComponent id={cursor} inputEvent={newStatementInputEvent} />
    </StatementWrapper>
  );
};

export const IfStatementEndComponent: React.FC<StatementComponentProps> = ({
  id,
  active,
}) => {
  const statement = useStatement<IfStatementEnd>(id);
  const newStatementInputEvent = useNewStatementInputEvent(
    statement.id,
    statement.indent
  );
  const deleteCurrentScopeInputEvent = useDeleteCurrentScopeInputEvent(
    statement.id
  );
  const [cursor] = statement.nodes;

  return (
    <StatementWrapper indent={statement.indent} active={active}>
      <BaseTextComopnent>endif</BaseTextComopnent>
      <CursorNodeComponent
        id={cursor}
        inputEvent={[
          ...newStatementInputEvent,
          ...deleteCurrentScopeInputEvent,
        ]}
      />
    </StatementWrapper>
  );
};
