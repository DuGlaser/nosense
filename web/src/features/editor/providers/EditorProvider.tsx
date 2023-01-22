import {
  convert2ListNode,
  convert2ListStatementItem,
  NODE_LIST_DEFAULT_STATE_STORE_KEY,
  NODES_DEFAULT_STATE_STORE_KEY,
  STATEMENT_LIST_DEFAULT_STATE_STORE_KEY,
  STATEMENTS_DEFAULT_STATE_STORE_KEY,
} from '@editor/store';
import { Lexer, Parser } from '@nosense/damega';
import { PropsWithChildren, useMemo } from 'react';
import { RecoilSync } from 'recoil-sync';

import { programConvertor } from '@/lib/converter';
import { Statement } from '@/lib/models/editorObject';

const parse2EditorStatements = (code: string): Statement[] => {
  if (code === '') return [];

  const l = new Lexer(code);
  const p = new Parser(l);
  const program = p.parseToken();
  if (p.errors.length > 0) {
    console.error(p.errors);
    return [];
  }

  return programConvertor.fromDamega(program);
};

export const EditorProvider: React.FC<
  PropsWithChildren<{
    defaultCode: string;
  }>
> = ({ defaultCode, children }) => {
  const stmts = useMemo(
    () => parse2EditorStatements(defaultCode),
    [defaultCode]
  );

  return (
    <RecoilSync
      storeKey={STATEMENT_LIST_DEFAULT_STATE_STORE_KEY}
      read={() => {
        return stmts.map(convert2ListStatementItem);
      }}
    >
      <RecoilSync
        storeKey={NODE_LIST_DEFAULT_STATE_STORE_KEY}
        read={() => {
          return stmts.flatMap(convert2ListNode);
        }}
      >
        <RecoilSync
          storeKey={STATEMENTS_DEFAULT_STATE_STORE_KEY}
          read={(id) => {
            const newStmt = stmts.find((stmt) => stmt.id === id);
            if (!newStmt)
              throw new Error('指定されたStatementが見つかりません');

            return {
              ...newStmt,
              nodes: newStmt.nodes.map((node) => node.id),
            };
          }}
        >
          <RecoilSync
            storeKey={NODES_DEFAULT_STATE_STORE_KEY}
            read={(id) => {
              const newNodes = stmts
                .flatMap((stmt) => stmt.nodes.find((node) => node.id === id))
                .filter((node) => !!node);
              const newNode = newNodes.length > 0 ? newNodes[0] : undefined;
              if (!newNode) throw new Error('指定されたNodeが見つかりません');

              return newNode;
            }}
          >
            {children}
          </RecoilSync>
        </RecoilSync>
      </RecoilSync>
    </RecoilSync>
  );
};
