import { EditableNodeComponent, StatementWrapper } from '@editor/components';
import { useNewStatementInputEvent } from '@editor/hooks/useNewStatementInputEvent';
import { useStatement } from '@editor/store';

import { ExpressionStatement } from '@/lib/models/editorObject';

export const ExpressionStatementComponent: React.FC<{
  id: ExpressionStatement['id'];
}> = ({ id }) => {
  const statement = useStatement<ExpressionStatement>(id);
  const newStatementInputEvent = useNewStatementInputEvent(
    statement.id,
    statement.indent
  );
  const [exp] = statement.nodes;

  return (
    <StatementWrapper indent={statement.indent}>
      <EditableNodeComponent id={exp} inputEvent={newStatementInputEvent} />
    </StatementWrapper>
  );
};
