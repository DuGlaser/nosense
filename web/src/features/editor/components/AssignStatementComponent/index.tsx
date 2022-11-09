import { EditableNodeComponent, StatementWrapper } from '@editor/components';
import { AssignStatement } from '@editor/lib';
import { useStatement } from '@editor/store';

export const AssignStatementComponent: React.FC<{
  id: AssignStatement['id'];
}> = ({ id }) => {
  const statement = useStatement<AssignStatement>(id);
  const [varName, exp] = statement.nodes;

  return (
    <StatementWrapper indent={statement.indent} needFrontSpace={true}>
      <EditableNodeComponent id={varName} />
      =
      <EditableNodeComponent id={exp} />
    </StatementWrapper>
  );
};
