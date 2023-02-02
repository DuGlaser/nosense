import {
  BaseTextComponent,
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
  const frontCursorNode = statement.nodes[0];
  const backCursorNode = statement.nodes[statement.nodes.length - 1];
  const args = statement.nodes.slice(1, statement.nodes.length - 1);
  const deleteStatementInputEvent = useDeleteStatementInputEvent([id]);
  const newStatementInputEvent = useNewStatementInputEvent(id, {
    nextIndent: statement.indent,
    prevIndent: statement.indent,
  });

  const inputEvent = [...newStatementInputEvent, ...deleteStatementInputEvent];

  return (
    <StatementWrapper statementId={id} indent={statement.indent} {...rest}>
      <CursorNodeComponent id={frontCursorNode} inputEvent={inputEvent} />
      <BaseTextComponent onClick={() => ref.current?.focus()}>
        {statement.functionName}(
      </BaseTextComponent>
      <Stack direction="row" divider={<span>,</span>}>
        {args.map((arg, i) => (
          <EditableNodeComponent
            ref={i === 0 ? ref : null}
            key={arg}
            id={arg}
            inputEvent={inputEvent}
          />
        ))}
      </Stack>
      <BaseTextComponent>)</BaseTextComponent>
      <CursorNodeComponent id={backCursorNode} inputEvent={inputEvent} />
    </StatementWrapper>
  );
};
