import { LetStatement as DamegaLetStatement, TOKEN } from '@nosense/damega';

import { createLetStatement, LetStatement } from '@/lib/models/editorObject';

const TYPE_NUMBER = '数値型';
const TYPE_STRING = '文字列型';
const TYPE_BOOLEAN = '論理型';

const token2EditorType = {
  [TOKEN.TYPE_NUMBER]: TYPE_NUMBER,
  [TOKEN.TYPE_STRING]: TYPE_STRING,
  [TOKEN.TYPE_BOOLEAN]: TYPE_BOOLEAN,
} as const;

const editorType2Damega = {
  [TYPE_NUMBER]: 'number',
  [TYPE_STRING]: 'string',
  [TYPE_BOOLEAN]: 'bool',
};

// TODO: そろそろlet文の形式を変えたほうがいいと思う。
export const letStatementConvertor = {
  fromDamega: (stmt: DamegaLetStatement): [LetStatement] => {
    const typeIdentToken = stmt.type.token.type;

    if (
      !(
        TOKEN.TYPE_NUMBER === typeIdentToken ||
        TOKEN.TYPE_STRING === typeIdentToken ||
        TOKEN.TYPE_BOOLEAN === typeIdentToken
      )
    ) {
      throw new Error(
        `${stmt.type.string()}は変数の型として正しくありません。`
      );
    }

    return [
      createLetStatement({
        type: token2EditorType[typeIdentToken],
        varNames: [stmt.name.string()],
      }),
    ];
  },
  toDamega: (stmt: LetStatement): string => {
    const [typeNode, ...varNames] = stmt.nodes;
    const typeIdent = typeNode.content;

    if (
      !(
        TYPE_NUMBER === typeIdent ||
        TYPE_STRING === typeIdent ||
        TYPE_BOOLEAN === typeIdent
      )
    ) {
      throw new Error(`${typeIdent}は変数の型として正しくありません。`);
    }

    const value =
      typeIdent === TYPE_NUMBER ? 0 : typeIdent === TYPE_STRING ? '""' : true;

    return `let ${varNames[0].content}: ${editorType2Damega[typeIdent]} = ${value};`;
  },
};
