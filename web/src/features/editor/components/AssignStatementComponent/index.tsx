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
  const newStatementInputEvent = useNewStatementInputEvent(statement.id, {
    nextIndent: statement.indent,
    prevIndent: statement.indent,
  });
  const deleteStatementInputEvent = useDeleteStatementInputEvent([
    statement.id,
  ]);

  const inputEvent = [...newStatementInputEvent, ...deleteStatementInputEvent];

  return (
    <StatementWrapper statementId={id} indent={statement.indent} {...rest}>
      <EditableNodeComponent
        id={varName}
        ref={ref}
        inputEvent={inputEvent}
        placeholder={'代入先'}
      />
      <KeyboardBackspaceIcon onClick={() => ref.current?.focus()} />
      <EditableNodeComponent
        id={exp}
        inputEvent={inputEvent}
        placeholder={'代入する値'}
      />
    </StatementWrapper>
  );
};
