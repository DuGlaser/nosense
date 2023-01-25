import { EditableNodeComponent, StatementWrapper } from '@editor/components';
import {
  useDeleteStatementInputEvent,
  useNewStatementInputEvent,
} from '@editor/hooks';
import { useStatement } from '@editor/store';
import { StatementComponentProps } from '@editor/type';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useRef } from 'react';

import { AssignStatement } from '@/lib/models/editorObject';

export const AssignStatementComponent: React.FC<StatementComponentProps> = ({
  id,
  ...rest
}) => {
  const statement = useStatement<AssignStatement>(id);
  const ref = useRef<HTMLDivElement>(null);
  const [varName, exp] = statement.nodes;
  const newStatementInputEvent = useNewStatementInputEvent(
    statement.id,
    statement.indent
  );
  const deleteStatementInputEvent = useDeleteStatementInputEvent([
    statement.id,
  ]);

  return (
    <StatementWrapper statementId={id} indent={statement.indent} {...rest}>
      <EditableNodeComponent
        id={varName}
        ref={ref}
        inputEvent={deleteStatementInputEvent}
      />
      <KeyboardBackspaceIcon onClick={() => ref.current?.focus()} />
      <EditableNodeComponent
        id={exp}
        inputEvent={[...newStatementInputEvent, ...deleteStatementInputEvent]}
      />
    </StatementWrapper>
  );
};
