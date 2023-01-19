import {
  BaseTextComopnent,
  CursorNodeComponent,
  EditableNodeComponent,
  StatementWrapper,
} from '@editor/components';
import { useNewStatementInputEvent } from '@editor/hooks';
import { useStatement } from '@editor/store';
import { StatementComponentProps } from '@editor/type';
import { Stack } from '@mui/material';

import { CallFunctionStatement } from '@/lib/models/editorObject';

export const CallFunctionStatementComponent: React.FC<
  StatementComponentProps
> = ({ id, active }) => {
  const statement = useStatement<CallFunctionStatement>(id);
  const args = statement.nodes.slice(0, statement.nodes.length - 1);
  const cursorNode = statement.nodes.at(-1)!;
  const newStatementInputEvent = useNewStatementInputEvent(
    id,
    statement.indent
  );

  return (
    <StatementWrapper indent={statement.indent} active={active}>
      <BaseTextComopnent>{statement.functionName}(</BaseTextComopnent>
      <Stack direction="row" divider={<span>,</span>}>
        {args.map((arg) => (
          <EditableNodeComponent key={arg} id={arg} />
        ))}
      </Stack>
      <BaseTextComopnent>)</BaseTextComopnent>
      <CursorNodeComponent
        id={cursorNode}
        inputEvent={newStatementInputEvent}
      />
    </StatementWrapper>
  );
};
