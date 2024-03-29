import {
  BaseTextComponent,
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
import { useRef } from 'react';

import {
  IfStatementElse,
  IfStatementEnd,
  IfStatementStart,
} from '@/lib/models/editorObject';

export const IfStatementStartComponent: React.FC<StatementComponentProps> = ({
  id,
  ...rest
}) => {
  const statement = useStatement<IfStatementStart>(id);
  const ref = useRef<HTMLDivElement>(null);
  const newStatementInputEvent = useNewStatementInputEvent(statement.id, {
    nextIndent: statement.indent + 1,
    prevIndent: statement.indent,
  });
  const deleteCurrentScopeInputEvent = useDeleteCurrentScopeInputEvent(
    statement.id
  );
  const [cursor, conditionExp, endCursor] = statement.nodes;

  const inputEvent = [
    ...newStatementInputEvent,
    ...deleteCurrentScopeInputEvent,
  ];

  return (
    <StatementWrapper statementId={id} indent={statement.indent} {...rest}>
      <CursorNodeComponent id={cursor} inputEvent={inputEvent} />
      <BaseTextComponent onClick={() => ref.current?.focus()}>
        if (
      </BaseTextComponent>
      <EditableNodeComponent
        id={conditionExp}
        ref={ref}
        placeholder={'条件文'}
        inputEvent={inputEvent}
      />
      <BaseTextComponent>)</BaseTextComponent>
      <CursorNodeComponent id={endCursor} inputEvent={inputEvent} />
    </StatementWrapper>
  );
};

export const IfStatementElseComponent: React.FC<StatementComponentProps> = ({
  id,
  ...rest
}) => {
  const statement = useStatement<IfStatementElse>(id);
  const newStatementInputEvent = useNewStatementInputEvent(statement.id, {
    nextIndent: statement.indent + 1,
    prevIndent: statement.indent + 1,
  });
  const [cursor] = statement.nodes;

  return (
    <StatementWrapper statementId={id} indent={statement.indent} {...rest}>
      <BaseTextComponent>else</BaseTextComponent>
      <CursorNodeComponent id={cursor} inputEvent={newStatementInputEvent} />
    </StatementWrapper>
  );
};

export const IfStatementEndComponent: React.FC<StatementComponentProps> = ({
  id,
  ...rest
}) => {
  const statement = useStatement<IfStatementEnd>(id);
  const ref = useRef<HTMLDivElement>(null);
  const newStatementInputEvent = useNewStatementInputEvent(statement.id, {
    nextIndent: statement.indent + 1,
    prevIndent: statement.indent,
  });
  const deleteCurrentScopeInputEvent = useDeleteCurrentScopeInputEvent(
    statement.id
  );
  const [cursor] = statement.nodes;

  return (
    <StatementWrapper statementId={id} indent={statement.indent} {...rest}>
      <BaseTextComponent onClick={() => ref.current?.focus()}>
        endif
      </BaseTextComponent>
      <CursorNodeComponent
        id={cursor}
        ref={ref}
        inputEvent={[
          ...newStatementInputEvent,
          ...deleteCurrentScopeInputEvent,
        ]}
      />
    </StatementWrapper>
  );
};
