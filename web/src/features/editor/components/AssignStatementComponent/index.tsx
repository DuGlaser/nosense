import { EditableNodeComponent, StatementWrapper } from '@editor/components';
import { useStatement } from '@editor/store';

import { AssignStatement } from '@/lib/models/editorObject';

export const AssignStatementComponent: React.FC<{
  id: AssignStatement['id'];
}> = ({ id }) => {
  const statement = useStatement<AssignStatement>(id);
  const [varName, exp] = statement.nodes;

  return (
    <StatementWrapper indent={statement.indent}>
      <EditableNodeComponent id={varName} />
      =
      <EditableNodeComponent id={exp} />
    </StatementWrapper>
  );
};
