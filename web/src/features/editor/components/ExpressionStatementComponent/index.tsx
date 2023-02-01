import { EditableNodeComponent, StatementWrapper } from '@editor/components';
import {
  useDeleteStatementInputEvent,
  useNextNewStatementInputEvent,
} from '@editor/hooks';
import { useStatement } from '@editor/store';
import { StatementComponentProps } from '@editor/type';

import { ExpressionStatement } from '@/lib/models/editorObject';

export const ExpressionStatementComponent: React.FC<
  StatementComponentProps
> = ({ id, ...rest }) => {
  const statement = useStatement<ExpressionStatement>(id);
  const newStatementInputEvent = useNextNewStatementInputEvent(
    statement.id,
    statement.indent
  );
  const deleteStatementInputEvent = useDeleteStatementInputEvent([
    statement.id,
  ]);
  const [exp] = statement.nodes;

  return (
    <StatementWrapper statementId={id} indent={statement.indent} {...rest}>
      <EditableNodeComponent
        id={exp}
        inputEvent={[...newStatementInputEvent, ...deleteStatementInputEvent]}
      />
    </StatementWrapper>
  );
};
