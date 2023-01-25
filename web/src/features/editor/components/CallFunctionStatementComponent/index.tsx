import {
  BaseTextComopnent,
  CursorNodeComponent,
  EditableNodeComponent,
  StatementWrapper,
} from '@editor/components';
import {
  useDeleteStatementInputEvent,
  useNewStatementInputEvent,
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
  const args = statement.nodes.slice(0, statement.nodes.length - 1);
  const cursorNode = statement.nodes.at(-1)!;
  const deleteStatementInputEvent = useDeleteStatementInputEvent([id]);
  const newStatementInputEvent = useNewStatementInputEvent(
    id,
    statement.indent
  );

  return (
    <StatementWrapper statementId={id} indent={statement.indent} {...rest}>
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
        id={cursorNode}
        inputEvent={[...newStatementInputEvent, ...deleteStatementInputEvent]}
      />
    </StatementWrapper>
  );
};
