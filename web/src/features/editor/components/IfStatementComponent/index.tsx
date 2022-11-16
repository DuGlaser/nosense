import {
  BaseTextComopnent,
  CursorNodeComponent,
  EditableNodeComponent,
  StatementWrapper,
} from '@editor/components';
import { useStatement } from '@editor/store';

import {
  IfStatementElse,
  IfStatementEnd,
  IfStatementStart,
} from '@/lib/models/editorObject';

export const IfStatementStartComponent: React.FC<{
  id: IfStatementStart['id'];
}> = ({ id }) => {
  const statement = useStatement<IfStatementStart>(id);
  const [cursor, conditionExp] = statement.nodes;

  return (
    <StatementWrapper indent={statement.indent}>
      <CursorNodeComponent id={cursor} />
      <BaseTextComopnent>if (</BaseTextComopnent>
      <EditableNodeComponent id={conditionExp} />
      <BaseTextComopnent>)</BaseTextComopnent>
    </StatementWrapper>
  );
};

export const IfStatementElseComponent: React.FC<{
  id: IfStatementElse['id'];
}> = ({ id }) => {
  const statement = useStatement<IfStatementElse>(id);
  const [cursor] = statement.nodes;

  return (
    <StatementWrapper indent={statement.indent}>
      <BaseTextComopnent>else</BaseTextComopnent>
      <CursorNodeComponent id={cursor} />
    </StatementWrapper>
  );
};

export const IfStatementEndComponent: React.FC<{
  id: IfStatementEnd['id'];
}> = ({ id }) => {
  const statement = useStatement<IfStatementEnd>(id);
  const [cursor] = statement.nodes;

  return (
    <StatementWrapper indent={statement.indent}>
      <BaseTextComopnent>endif</BaseTextComopnent>
      <CursorNodeComponent id={cursor} />
    </StatementWrapper>
  );
};
