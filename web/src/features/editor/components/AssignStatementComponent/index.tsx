import { EditableNodeComponent, StatementWrapper } from '@editor/components';
import { useNewStatementInputEvent } from '@editor/hooks/useNewStatementInputEvent';
import { useStatement } from '@editor/store';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

import { AssignStatement } from '@/lib/models/editorObject';

export const AssignStatementComponent: React.FC<{
  id: AssignStatement['id'];
}> = ({ id }) => {
  const statement = useStatement<AssignStatement>(id);
  const [varName, exp] = statement.nodes;
  const newStatementInputEvent = useNewStatementInputEvent(
    statement.id,
    statement.indent
  );

  return (
    <StatementWrapper indent={statement.indent}>
      <EditableNodeComponent id={varName} />
      <KeyboardBackspaceIcon />
      <EditableNodeComponent id={exp} inputEvent={newStatementInputEvent} />
    </StatementWrapper>
  );
};
