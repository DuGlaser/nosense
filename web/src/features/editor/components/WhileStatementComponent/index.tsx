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
  WhileStatementEnd,
  WhileStatementStart,
} from '@/lib/models/editorObject';

export const WhileStatementStartComponent: React.FC<
  StatementComponentProps
> = ({ id, active }) => {
  const statement = useStatement<WhileStatementStart>(id);
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
      <BaseTextComopnent>while (</BaseTextComopnent>
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

export const WhileStatementEndComponent: React.FC<StatementComponentProps> = ({
  id,
  active,
}) => {
  const statement = useStatement<WhileStatementEnd>(id);
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
      <BaseTextComopnent>endwhile</BaseTextComopnent>
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
