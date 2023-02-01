import {
  BaseTextComopnent,
  CursorNodeComponent,
  EditableNodeComponent,
  StatementWrapper,
} from '@editor/components';
import {
  useDeleteCurrentScopeInputEvent,
  useNextNewStatementInputEvent,
  usePrevNewStatementInputEvent,
} from '@editor/hooks';
import { useStatement } from '@editor/store';
import { StatementComponentProps } from '@editor/type';
import { useRef } from 'react';

import {
  WhileStatementEnd,
  WhileStatementStart,
} from '@/lib/models/editorObject';

export const WhileStatementStartComponent: React.FC<
  StatementComponentProps
> = ({ id, ...rest }) => {
  const statement = useStatement<WhileStatementStart>(id);
  const ref = useRef<HTMLDivElement>(null);
  const newNextStatementInputEvent = useNextNewStatementInputEvent(
    statement.id,
    statement.indent + 1
  );
  const newPrevStatementInputEvent = usePrevNewStatementInputEvent(
    statement.id,
    statement.indent
  );
  const deleteCurrentScopeInputEvent = useDeleteCurrentScopeInputEvent(
    statement.id
  );
  const [cursor, conditionExp, endCursor] = statement.nodes;

  return (
    <StatementWrapper statementId={id} indent={statement.indent} {...rest}>
      <CursorNodeComponent
        id={cursor}
        inputEvent={[
          ...deleteCurrentScopeInputEvent,
          ...newPrevStatementInputEvent,
        ]}
      />
      <BaseTextComopnent onClick={() => ref.current?.focus()}>
        while (
      </BaseTextComopnent>
      <EditableNodeComponent
        id={conditionExp}
        ref={ref}
        placeholder={'条件文'}
      />
      <BaseTextComopnent>)</BaseTextComopnent>
      <CursorNodeComponent
        id={endCursor}
        inputEvent={[
          ...newNextStatementInputEvent,
          ...deleteCurrentScopeInputEvent,
        ]}
      />
    </StatementWrapper>
  );
};

export const WhileStatementEndComponent: React.FC<StatementComponentProps> = ({
  id,
  ...rest
}) => {
  const statement = useStatement<WhileStatementEnd>(id);
  const ref = useRef<HTMLDivElement>(null);
  const newStatementInputEvent = useNextNewStatementInputEvent(
    statement.id,
    statement.indent
  );
  const deleteCurrentScopeInputEvent = useDeleteCurrentScopeInputEvent(
    statement.id
  );
  const [cursor] = statement.nodes;

  return (
    <StatementWrapper statementId={id} indent={statement.indent} {...rest}>
      <BaseTextComopnent onClick={() => ref.current?.focus()}>
        endwhile
      </BaseTextComopnent>
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
