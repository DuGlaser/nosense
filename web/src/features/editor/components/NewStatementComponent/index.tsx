import { CursorNodeComponent, StatementWrapper } from '@editor/components';
import { CompleteOption, useDeleteStatementInputEvent } from '@editor/hooks';
import {
  useDeleteStatement,
  useFocusStatemnt,
  useInsertStatement,
  useStatement,
} from '@editor/store';
import { styled } from '@mui/material';
import { useRef } from 'react';

import {
  createAssignStatement,
  createExpressionStatement,
  createIfStatementEnd,
  createIfStatementStart,
  createLetStatement,
  createNewStatement,
  createWhileStatementEnd,
  createWhileStatementStart,
  CursorNode,
  Statement,
} from '@/lib/models/editorObject';

const Placeholder = styled('div')({
  opacity: 0.5,
});

export const NewStatementComponent: React.FC<{ id: CursorNode['id'] }> = ({
  id,
}) => {
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
      displayName: '変数宣言',
      keyword: [],
      onComplete: () => {
        insertNewStatement([createLetStatement({ type: '', varNames: [''] })]);
      },
    },
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
              createExpressionStatement({
                exp: 'Obniz.CONNECT()',
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
              createExpressionStatement({
                exp: 'Obniz.CLOSE()',
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
                  createExpressionStatement({
                    exp: 'Obniz.LED.ON()',
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
                  createExpressionStatement({
                    exp: 'Obniz.LED.OFF()',
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
                  createExpressionStatement({
                    exp: 'Obniz.LED.BLINK()',
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
                  createExpressionStatement({
                    exp: 'Obniz.LED.END_BLINK()',
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
              createExpressionStatement({
                exp: 'Println()',
                indent: statement.indent,
              }),
            ]);
          },
        },
      ],
    },
  ];

  return (
    <StatementWrapper indent={statement.indent} active={false}>
      <CursorNodeComponent
        ref={ref}
        id={cursor}
        completeOptions={options}
        inputEvent={deleteStatementInputEvent}
        onInput={(e) => {
          e.preventDefault();
        }}
      />
      <Placeholder onClick={() => ref.current?.focus()}>
        追加したい文を選択してください
      </Placeholder>
    </StatementWrapper>
  );
};
