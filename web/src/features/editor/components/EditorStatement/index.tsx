import { FC } from 'react';
import { match, P } from 'ts-pattern';

import {
  IfStatementComponent,
  LetStatementComponent,
} from '@/features/editor/components';
import { StatementProps } from '@/features/editor/type';
import { AstObject } from '@/lib/models/astObjects';

export const EditorStatement: FC<StatementProps<AstObject>> = ({
  astObject,
}) => {
  return match(astObject)
    .with({ _type: 'LetStatement' }, (_) => (
      <LetStatementComponent astObject={_} />
    ))
    .with({ _type: 'IfStatement' }, (_) => (
      <IfStatementComponent astObject={_} />
    ))
    .with(P.nullish, () => null)
    .exhaustive();
};
