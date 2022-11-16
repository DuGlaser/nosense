import { EditableNodeComponent, StatementWrapper } from '@editor/components';
import { useStatement } from '@editor/store';

import { ExpressionStatement } from '@/lib/models/editorObject';

export const ExpressionStatementComponent: React.FC<{
  id: ExpressionStatement['id'];
}> = ({ id }) => {
  const statement = useStatement(id);
  const [exp] = statement.nodes;

  return (
    <StatementWrapper indent={statement.indent} needFrontSpace={false}>
      <EditableNodeComponent id={exp} />
    </StatementWrapper>
  );
};
