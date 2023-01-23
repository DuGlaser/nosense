import {
  convert2ListNode,
  convert2ListStatementItem,
  NODE_LIST_DEFAULT_STATE_STORE_KEY,
  NODES_DEFAULT_STATE_STORE_KEY,
  STATEMENT_LIST_DEFAULT_STATE_STORE_KEY,
  STATEMENTS_DEFAULT_STATE_STORE_KEY,
} from '@editor/store';
import { PropsWithChildren } from 'react';
import { RecoilSync } from 'recoil-sync';

import { Statement } from '@/lib/models/editorObject';

export const EditorProvider: React.FC<
  PropsWithChildren<{
    defaultStatements: Statement[];
  }>
> = ({ defaultStatements, children }) => {
  return (
    <RecoilSync
      storeKey={STATEMENT_LIST_DEFAULT_STATE_STORE_KEY}
      read={() => {
        return defaultStatements.map(convert2ListStatementItem);
      }}
    >
      <RecoilSync
        storeKey={NODE_LIST_DEFAULT_STATE_STORE_KEY}
        read={() => {
          return defaultStatements.flatMap(convert2ListNode);
        }}
      >
        <RecoilSync
          storeKey={STATEMENTS_DEFAULT_STATE_STORE_KEY}
          read={(id) => {
            const newStmt = defaultStatements.find((stmt) => stmt.id === id);
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
              const newNodes = defaultStatements
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
