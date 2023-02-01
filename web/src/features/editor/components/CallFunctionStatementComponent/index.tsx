import {
  BaseTextComopnent,
  CursorNodeComponent,
  EditableNodeComponent,
  StatementWrapper,
} from '@editor/components';
import {
  useDeleteStatementInputEvent,
  useNextNewStatementInputEvent,
  usePrevNewStatementInputEvent,
} from '@editor/hooks';
import { useStatement } from '@editor/store';
import { StatementComponentProps } from '@editor/type';
import { Stack } from '@mui/material';
import { useRef } from 'react';

import { CallFunctionStatement } from '@/lib/models/editorObject';

export const CallFunctionStatementComponent: React.FC<
  StatementComponentProps
> = ({ id, ...rest }) => {
  const statement = useStatement<CallFunctionStatement>(id);
  const ref = useRef<HTMLDivElement>(null);
  const frontCursorNode = statement.nodes[0];
  const backCursorNode = statement.nodes[statement.nodes.length - 1];
  const args = statement.nodes.slice(1, statement.nodes.length - 1);
  const deleteStatementInputEvent = useDeleteStatementInputEvent([id]);
  const newNextStatementInputEvent = useNextNewStatementInputEvent(
    id,
    statement.indent
  );
  const newPrevStatementInputEvent = usePrevNewStatementInputEvent(
    statement.id,
    statement.indent
  );

  return (
    <StatementWrapper statementId={id} indent={statement.indent} {...rest}>
      <CursorNodeComponent
        id={frontCursorNode}
        inputEvent={[
          ...newPrevStatementInputEvent,
          ...deleteStatementInputEvent,
        ]}
      />
      <BaseTextComopnent onClick={() => ref.current?.focus()}>
        {statement.functionName}(
      </BaseTextComopnent>
      <Stack direction="row" divider={<span>,</span>}>
        {args.map((arg, i) => (
          <EditableNodeComponent
            ref={i === 0 ? ref : null}
            key={arg}
            id={arg}
            inputEvent={deleteStatementInputEvent}
          />
        ))}
      </Stack>
      <BaseTextComopnent>)</BaseTextComopnent>
      <CursorNodeComponent
        id={backCursorNode}
        inputEvent={[
          ...newNextStatementInputEvent,
          ...deleteStatementInputEvent,
        ]}
      />
    </StatementWrapper>
  );
};
