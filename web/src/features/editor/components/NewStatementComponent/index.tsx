import { EditableNodeComponent, StatementWrapper } from '@editor/components';
import { CompleteOption, useDeleteStatementInputEvent } from '@editor/hooks';
import {
  useDeleteStatement,
  useFocusStatemnt,
  useInsertStatement,
  useStatement,
} from '@editor/store';
import { useRef } from 'react';

import {
  createAssignStatement,
  createCallFunctionStatement,
  createIfStatementEnd,
  createIfStatementStart,
  createNewStatement,
  createWhileStatementEnd,
  createWhileStatementStart,
  CursorNode,
  Statement,
} from '@/lib/models/editorObject';

export const NewStatementComponent: React.FC<{
  id: CursorNode['id'];
  lineNumber: number;
}> = ({ id, ...rest }) => {
  const insertStmt = useInsertStatement();
  const deleteStmt = useDeleteStatement();
  const statement = useStatement(id);
  const focusStatement = useFocusStatemnt();
  const [cursor] = statement.nodes;

  const ref = useRef<HTMLDivElement>(null);

  const insertNewStatement = (stmts: Statement[]) => {
    insertStmt(id, stmts);
    deleteStmt(id);
    /**
     * NOTE:
     * 0msだとfocusは当たるが、入力可能状態にならない
     * もう少しいい方法考えたほうがいいかもしれない
     * nodeにonRenderみたいなものを生やして、refに値を入れるタイミングでonRenderを実行するのはどうだろうか？
     **/
    setTimeout(() => {
      focusStatement(stmts[0].id);
    }, 1);
  };

  const deleteStatementInputEvent = useDeleteStatementInputEvent([id]);

  const options: CompleteOption[] = [
    {
      displayName: '代入文',
      keyword: [],
      onComplete: () => {
        insertNewStatement([
          createAssignStatement({
            name: '',
            value: '',
            indent: statement.indent,
          }),
        ]);
      },
    },
    {
      displayName: 'if文',
      keyword: [],
      onComplete: () => {
        insertNewStatement([
          createIfStatementStart({
            condition: '',
            indent: statement.indent,
          }),
          createNewStatement({ indent: statement.indent + 1 }),
          createIfStatementEnd({ indent: statement.indent }),
        ]);
      },
    },
    {
      displayName: 'while文',
      keyword: [],
      onComplete: () => {
        insertNewStatement([
          createWhileStatementStart({
            condition: '',
            indent: statement.indent,
          }),
          createNewStatement({ indent: statement.indent + 1 }),
          createWhileStatementEnd({ indent: statement.indent }),
        ]);
      },
    },
    {
      displayName: 'Obniz命令',
      keyword: [],
      completeOptions: [
        {
          displayName: '接続',
          keyword: [],
          onComplete: () => {
            insertNewStatement([
              createCallFunctionStatement({
                functionName: 'Obniz.CONNECT',
                args: [{ defaultValue: '', placeholder: 'obnizID' }],
                indent: statement.indent,
              }),
            ]);
          },
        },
        {
          displayName: '切断',
          keyword: [],
          onComplete: () => {
            insertNewStatement([
              createCallFunctionStatement({
                functionName: 'Obniz.CLOSE',
                args: [],
                indent: statement.indent,
              }),
            ]);
          },
        },
        {
          displayName: 'LED',
          completeOptions: [
            {
              displayName: '点灯',
              keyword: [],
              onComplete: () => {
                insertNewStatement([
                  createCallFunctionStatement({
                    functionName: 'Obniz.LED.ON',
                    args: [
                      { defaultValue: '', placeholder: 'anodeの番号' },
                      { defaultValue: '', placeholder: 'cathodeの番号' },
                    ],
                    indent: statement.indent,
                  }),
                ]);
              },
            },
            {
              displayName: '消灯',
              keyword: [],
              onComplete: () => {
                insertNewStatement([
                  createCallFunctionStatement({
                    functionName: 'Obniz.LED.OFF',
                    args: [
                      { defaultValue: '', placeholder: 'anodeの番号' },
                      { defaultValue: '', placeholder: 'cathodeの番号' },
                    ],
                    indent: statement.indent,
                  }),
                ]);
              },
            },
            {
              displayName: '点滅開始',
              keyword: [],
              onComplete: () => {
                insertNewStatement([
                  createCallFunctionStatement({
                    functionName: 'Obniz.LED.BLINK',
                    args: [
                      { defaultValue: '', placeholder: 'anodeの番号' },
                      { defaultValue: '', placeholder: 'cathodeの番号' },
                    ],
                    indent: statement.indent,
                  }),
                ]);
              },
            },
            {
              displayName: '点滅終了',
              keyword: [],
              onComplete: () => {
                insertNewStatement([
                  createCallFunctionStatement({
                    functionName: 'Obniz.LED.END_BLINK',
                    args: [
                      { defaultValue: '', placeholder: 'anodeの番号' },
                      { defaultValue: '', placeholder: 'cathodeの番号' },
                    ],
                    indent: statement.indent,
                  }),
                ]);
              },
            },
          ],
        },
      ],
    },
    {
      displayName: '組み込み関数',
      keyword: [],
      completeOptions: [
        {
          displayName: '入力',
          keyword: [],
          onComplete: () => {
            insertNewStatement([
              createAssignStatement({
                name: '',
                value: 'Input()',
                indent: statement.indent,
              }),
            ]);
          },
        },
        {
          displayName: '出力',
          keyword: [],
          onComplete: () => {
            insertNewStatement([
              createCallFunctionStatement({
                functionName: 'Println',
                args: [{ defaultValue: '', placeholder: '出力したいもの' }],
                indent: statement.indent,
              }),
            ]);
          },
        },
        {
          displayName: 'スリープ',
          keyword: [],
          onComplete: () => {
            insertNewStatement([
              createCallFunctionStatement({
                functionName: 'Sleep',
                args: [
                  { defaultValue: '', placeholder: 'スリープする時間(ミリ秒)' },
                ],
                indent: statement.indent,
              }),
            ]);
          },
        },
      ],
    },
  ];

  return (
    <StatementWrapper
      statementId={id}
      indent={statement.indent}
      active={false}
      {...rest}
    >
      <EditableNodeComponent
        ref={ref}
        id={cursor}
        completeOptions={options}
        inputEvent={deleteStatementInputEvent}
        placeholder={'追加したい文を選択してください'}
        onKeyDown={(e) => {
          e.preventDefault();
        }}
        onInput={(e) => {
          e.preventDefault();
        }}
      />
    </StatementWrapper>
  );
};
