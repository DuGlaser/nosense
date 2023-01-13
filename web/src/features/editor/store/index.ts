import { Mode, mode } from '@editor/type';
import { literal, union } from '@recoiljs/refine';
import { useCallback } from 'react';
import {
  atom,
  atomFamily,
  selectorFamily,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { syncEffect } from 'recoil-sync';

import { Node, Statement } from '@/lib/models/editorObject';

/**
 * StatementのNodesはNode型のtuple arrayなので、
 * そこからidだけを抽出したstring tuple arrayに変換する。
 * useStatementを使う際にNodeをtupleとして扱いたいのでこのようにしている。
 * 型が複雑になり一部ts-ignoreしないと行けないが、useStatement側を使う機会のほうが
 * 多いと判断し、今は使っている。
 **/
type NodesToIds<T extends Node[], K extends Node['id'][] = []> = T extends [
  Node,
  ...infer R
]
  ? R extends Node[]
    ? // NOTE: 先頭要素以外を取り除いたRで再帰させる
      NodesToIds<R, [...K, T[0]['id']]>
    : []
  : // NOTE: ...Node[]などはマッチしないのでここで処理させる
  T extends []
  ? [...K]
  : [...K, ...Node['id'][]];

type AtomStatement<T extends Statement> = Omit<T, 'nodes'> & {
  nodes: NodesToIds<T['nodes']>;
};

type ListStatementItem = Pick<Statement, 'id' | '_type'>;
type ListNodeItem = Pick<Node, 'id' | '_type'>;

const convert2ListStatementItem = (statement: Statement): ListStatementItem => {
  return {
    id: statement.id,
    _type: statement._type,
  };
};

const convert2ListNodeItem = (node: Node): ListNodeItem => {
  return {
    id: node.id,
    _type: node._type,
  };
};

const convert2ListNode = (statement: Statement): ListNodeItem[] => {
  return statement.nodes.map(convert2ListNodeItem);
};

const statementsState = atomFamily<AtomStatement<Statement>, Statement['id']>({
  key: 'statements',
});

const statementListState = atom<ListStatementItem[]>({
  key: 'statementList',
  default: [],
});

const nodesState = atomFamily<Node, Node['id']>({
  key: 'nodes',
});

const nodeListState = atom<ListNodeItem[]>({
  key: 'nodeList',
  default: [],
});

const nextNodeState = selectorFamily<Node | undefined, Node['id']>({
  key: 'nextNode',
  get:
    (id) =>
    ({ get }) => {
      const nodeList = get(nodeListState);
      const index = nodeList.findIndex((item) => item.id === id);
      if (index < 0) return;
      if (index + 1 === nodeList.length) return;
      return get(nodesState(nodeList[index + 1].id));
    },
});

const prevNodeState = selectorFamily<Node | undefined, Node['id']>({
  key: 'prevNode',
  get:
    (id) =>
    ({ get }) => {
      const nodeList = get(nodeListState);
      const index = nodeList.findIndex((item) => item.id === id);
      if (index - 1 < 0) return;
      return get(nodesState(nodeList[index - 1].id));
    },
});

const statementDetailState = selectorFamily<Statement, Statement['id']>({
  key: 'statementDetail',
  get:
    (id) =>
    ({ get }) => {
      const statement = get(statementsState(id));
      const nodes = statement.nodes.map((node) => get(nodesState(node)));

      return {
        ...statement,
        nodes,
      } as Statement;
    },
});

const statementLastNodeIdState = selectorFamily<
  Node['id'] | undefined,
  AtomStatement<Statement>['id']
>({
  key: 'statementLastNodeId',
  get:
    (id) =>
    ({ get }) => {
      const nodelist = get(statementsState(id)).nodes;
      return nodelist.length === 0 ? undefined : nodelist.at(-1);
    },
});

export const useInsertNode = <T extends Statement>(statementId: T['id']) => {
  return useRecoilCallback(
    ({ set }) =>
      (beforeNodeId: T['id'] | undefined, newNode: Node) => {
        set(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          statementsState(statementId),
          (cur: AtomStatement<T>): AtomStatement<T> => {
            const nodes = cur.nodes;
            const beforeNodeIndex = beforeNodeId
              ? nodes.findIndex((node) => node === beforeNodeId)
              : -1;
            const left = nodes.slice(0, beforeNodeIndex + 1);
            const right = nodes.slice(beforeNodeIndex + 1);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return {
              ...cur,
              nodes: left.concat(newNode.id, right),
            };
          }
        );

        set(nodesState(newNode.id), newNode);
        set(nodeListState, (nodeList) => {
          const beforeNodeIndex = beforeNodeId
            ? nodeList.findIndex((node) => node.id === beforeNodeId)
            : -1;

          const left = nodeList.slice(0, beforeNodeIndex + 1);
          const right = nodeList.slice(beforeNodeIndex + 1);
          return left.concat([convert2ListNodeItem(newNode)], right);
        });
      },
    [statementId]
  );
};

export const useStatements = () => {
  return useRecoilCallback(({ snapshot }) => async () => {
    const list = await snapshot.getPromise(statementListState);
    const statements = await Promise.all(
      list.map((item) => snapshot.getPromise(statementDetailState(item.id)))
    );

    return statements;
  });
};

export const useStatement = <T extends Statement>(id: T['id']) => {
  return useRecoilValue<AtomStatement<T>>(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    statementsState(id)
  );
};

export const useDeleteStatement = () => {
  return useRecoilCallback(
    ({ set, reset, snapshot }) =>
      async (id: Statement['id']) => {
        const stmt = await snapshot.getPromise(statementsState(id));
        set(statementListState, (cur) => cur.filter((item) => item.id !== id));
        set(nodeListState, (cur) =>
          cur.filter((item) => !stmt.nodes.includes(item.id))
        );
        reset(statementsState(id));
      }
  );
};

export const useGetCurrentScope = () => {
  const statementList = useStatementList();

  return useRecoilCallback(({ snapshot }) => async (id: Statement['id']) => {
    const currentIndex = statementList.findIndex((stmt) => stmt.id === id);
    if (currentIndex === -1) return [];

    const currentStmt = await snapshot.getPromise(statementsState(id));
    const targetScopeIndent = currentStmt.indent;

    const next = (async (index) => {
      let i = index + 1;
      const result = [];
      let prevStmtIndent = currentStmt.indent;
      while (i < statementList.length) {
        const stmt = await snapshot.getPromise(
          statementsState(statementList[i].id)
        );

        if (stmt.indent > targetScopeIndent) {
          result.push(stmt.id);
        } else if (
          stmt.indent === targetScopeIndent &&
          prevStmtIndent > stmt.indent
        ) {
          result.push(stmt.id);
        } else {
          break;
        }

        prevStmtIndent = stmt.indent;
        i++;
      }

      return result;
    })(currentIndex);

    const prev = (async (index) => {
      let i = index - 1;
      const result = [];
      let nextStmtIndent = currentStmt.indent;
      while (i >= 0) {
        const stmt = await snapshot.getPromise(
          statementsState(statementList[i].id)
        );

        if (stmt.indent > targetScopeIndent) {
          result.push(stmt.id);
        } else if (
          stmt.indent === targetScopeIndent &&
          nextStmtIndent > stmt.indent
        ) {
          result.push(stmt.id);
        } else {
          break;
        }

        nextStmtIndent = stmt.indent;
        i--;
      }

      return result.reverse();
    })(currentIndex);

    const [_next, _prev] = await Promise.all([next, prev]);

    return _prev.concat([currentStmt.id], _next);
  });
};

export const useInsertStatement = () => {
  return useRecoilCallback(
    ({ set, snapshot }) =>
      async (
        beforeStatementId: Statement['id'] | undefined,
        newStmts: Statement[]
      ) => {
        set(statementListState, (cur) => {
          const beforeStmtIndex = beforeStatementId
            ? cur.findIndex((stmt) => stmt.id === beforeStatementId)
            : -1;
          const left = cur.slice(0, beforeStmtIndex + 1);
          const right = cur.slice(beforeStmtIndex + 1);

          return left.concat(newStmts.map(convert2ListStatementItem), right);
        });

        newStmts.forEach((newStmt) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          set(statementsState(newStmt.id), {
            ...newStmt,
            nodes: newStmt.nodes.map((node) => node.id),
          });
          newStmt.nodes.forEach((node) => {
            set(nodesState(node.id), node);
          });
        });

        const beforeStmtLastNodeId = !beforeStatementId
          ? undefined
          : await snapshot.getPromise(
              statementLastNodeIdState(beforeStatementId)
            );

        set(nodeListState, (cur) => {
          const beforeNodeIndex = beforeStmtLastNodeId
            ? cur.findIndex((node) => node.id === beforeStmtLastNodeId)
            : -1;

          const left = cur.slice(0, beforeNodeIndex + 1);
          const right = cur.slice(beforeNodeIndex + 1);

          return left.concat(newStmts.flatMap(convert2ListNode), right);
        });
      },
    []
  );
};

export const useStatementList = () => {
  return useRecoilValue(statementListState);
};

const focusElementLast = (element: Element) => {
  const textLength =
    element.childNodes.length > 0
      ? element.childNodes[0].textContent?.length ?? 0
      : 0;
  const range = document.createRange();

  const targetElement =
    element.childNodes.length > 0 ? element.childNodes[0] : element;
  range.setStart(targetElement, textLength);

  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
};

const focusElementFirst = (element: Element) => {
  const range = document.createRange();

  const targetElement =
    element.childNodes.length > 0 ? element.childNodes[0] : element;
  range.setStart(targetElement, 0);

  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
  selection?.addRange(range);
};

export const useFocusStatemnt = () => {
  return useRecoilCallback(
    ({ snapshot }) =>
      async (id: Statement['id']) => {
        const stmt = await snapshot.getPromise(statementsState(id));
        const firstNode = await snapshot.getPromise(nodesState(stmt.nodes[0]));
        if (!firstNode.ref) return;
        focusElementFirst(firstNode.ref);
      },
    []
  );
};

export const useMoveNextStatement = () => {
  const stmtList = useRecoilValue(statementListState);

  return useRecoilCallback(
    ({ snapshot }) =>
      async (id: Statement['id']) => {
        const index = stmtList.findIndex((item) => item.id === id);
        if (index === -1 || index === stmtList.length - 1) return;

        const nextStmt = await snapshot.getPromise(
          statementsState(stmtList[index + 1].id)
        );
        const firstNode = await snapshot.getPromise(
          nodesState(nextStmt.nodes[0])
        );

        const element = firstNode?.ref;
        if (!element) return;

        focusElementFirst(element);
      },
    [stmtList]
  );
};

export const useMovePrevStatement = () => {
  const stmtList = useRecoilValue(statementListState);

  return useRecoilCallback(
    ({ snapshot }) =>
      async (id: Statement['id']) => {
        const index = stmtList.findIndex((item) => item.id === id);
        if (index <= 0) return;

        const prevStmt = await snapshot.getPromise(
          statementsState(stmtList[index - 1].id)
        );
        const firstNode = await snapshot.getPromise(
          nodesState(prevStmt.nodes[0])
        );

        const element = firstNode?.ref;
        if (!element) return;

        focusElementFirst(element);
      },
    [stmtList]
  );
};

export const useNode = <T extends Node>(id: T['id']) => {
  const [node, setNode] = useRecoilState(nodesState(id));
  const nextNode = useRecoilValue(nextNodeState(id));
  const prevNode = useRecoilValue(prevNodeState(id));

  const ref = useCallback(
    (element: HTMLDivElement | null) => {
      if (!element || node.ref) return;
      setNode((cur) => ({ ...cur, ref: element }));
    },
    [id, setNode, node]
  );

  const moveNextNode = useRecoilCallback(
    () => async () => {
      const element = nextNode?.ref;
      if (!element) return;
      focusElementFirst(element);
    },
    [id, nextNode?.ref]
  );

  const movePrevNode = useRecoilCallback(
    () => async () => {
      const element = prevNode?.ref;
      if (!element) return;
      focusElementLast(element);
    },
    [id, prevNode?.ref]
  );

  const moveCurrentNodeLast = useRecoilCallback(
    () => async () => {
      const element = node?.ref;
      if (!element) return;
      focusElementLast(element);
    },
    [id, node?.ref]
  );

  return {
    node,
    setNode,
    ref,
    moveNextNode,
    movePrevNode,
    moveCurrentNodeLast,
  };
};

export const EDITOR_MODE_STORE_KEY = 'editorMode';

const editorModeState = atom<Mode>({
  key: 'editorMode',
  effects: [
    syncEffect({
      storeKey: EDITOR_MODE_STORE_KEY,
      refine: union(...mode.map((_) => literal(_))),
    }),
  ],
});

export const useEditorMode = () => {
  return useRecoilValue(editorModeState);
};
