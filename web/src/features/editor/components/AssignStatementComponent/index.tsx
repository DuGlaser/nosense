import { EditableNodeComponent, StatementWrapper } from '@editor/components';
import {
  useDeleteStatementInputEvent,
  useNewStatementInputEvent,
} from '@editor/hooks';
import { useStatement } from '@editor/store';
import { StatementComponentProps } from '@editor/type';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

import { AssignStatement } from '@/lib/models/editorObject';

export const AssignStatementComponent: React.FC<StatementComponentProps> = ({
  id,
  active,
}) => {
  const statement = useStatement<AssignStatement>(id);
  const [varName, exp] = statement.nodes;
  const newStatementInputEvent = useNewStatementInputEvent(
    statement.id,
    statement.indent
  );
  const deleteStatementInputEvent = useDeleteStatementInputEvent([
    statement.id,
  ]);

  return (
    <StatementWrapper indent={statement.indent} active={active}>
      <EditableNodeComponent
        id={varName}
        inputEvent={deleteStatementInputEvent}
      />
      <KeyboardBackspaceIcon />
      <EditableNodeComponent
        id={exp}
        inputEvent={[...newStatementInputEvent, ...deleteStatementInputEvent]}
      />
    </StatementWrapper>
  );
};
