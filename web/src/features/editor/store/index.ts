import {
  array,
  bool,
  nullable,
  number,
  object,
  string,
} from '@recoiljs/refine';
import { useCallback, useMemo, useRef } from 'react';
import {
  atom,
  atomFamily,
  selectorFamily,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { syncEffect } from 'recoil-sync';

import {
  createLetStatement,
  createNewStatement,
  Node,
  Statement,
  StatementType,
  statementType,
} from '@/lib/models/editorObject';

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

export const convert2ListStatementItem = (
  statement: Statement
): ListStatementItem => {
  return {
    id: statement.id,
    _type: statement._type,
  };
};

export const convert2ListNodeItem = (node: Node): ListNodeItem => {
  return {
    id: node.id,
    _type: node._type,
  };
};

export const convert2ListNode = (statement: Statement): ListNodeItem[] => {
  return statement.nodes.map(convert2ListNodeItem);
};

export const STATEMENTS_DEFAULT_STATE_STORE_KEY =
  'statementsDefaultStateStoreKey';

const statementsState = atomFamily<AtomStatement<Statement>, Statement['id']>({
  key: 'statements',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  effects: (id) => [
    syncEffect({
      storeKey: STATEMENTS_DEFAULT_STATE_STORE_KEY,
      itemKey: id,
      refine: object({
        _type: string(),
        id: string(),
        functionName: nullable(string()),
        nodes: array(string()),
        indent: number(),
      }),
    }),
  ],
});

export const STATEMENT_LIST_DEFAULT_STATE_STORE_KEY =
  'statementListDefaultStateStoreKey';

const statementListState = atom<ListStatementItem[]>({
  key: 'statementList',
  default: [],
  effects: [
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    syncEffect({
      storeKey: STATEMENT_LIST_DEFAULT_STATE_STORE_KEY,
      refine: array(
        object({
          _type: string(),
          id: string(),
        })
      ),
    }),
  ],
});

export const NODES_DEFAULT_STATE_STORE_KEY = 'nodesDefaultStateStoreKey';

const nodesState = atomFamily<Node, Node['id']>({
  key: 'nodes',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  effects: (id) => [
    syncEffect({
      storeKey: NODES_DEFAULT_STATE_STORE_KEY,
      itemKey: id,
      refine: object({
        _type: string(),
        id: string(),
        parentId: string(),
        content: string(),
        placeholder: nullable(string()),
        editable: bool(),
        deletable: bool(),
      }),
    }),
  ],
});

export const NODE_LIST_DEFAULT_STATE_STORE_KEY = 'nodeListDefaultStateStoreKey';

const nodeListState = atom<ListNodeItem[]>({
  key: 'nodeList',
  default: [],
  effects: [
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    syncEffect({
      storeKey: NODE_LIST_DEFAULT_STATE_STORE_KEY,
      refine: array(
        object({
          _type: string(),
          id: string(),
        })
      ),
    }),
  ],
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

const statementPair: Record<
  StatementType[number],
  { next?: StatementType; prev?: StatementType }
> = {
  [statementType.WhileStatementStart]: {
    next: statementType.WhileStatementEnd,
  },
  [statementType.WhileStatementEnd]: {
    prev: statementType.WhileStatementStart,
  },
  [statementType.IfStatementStart]: {
    next: statementType.IfStatementEnd,
  },
  [statementType.IfStatementEnd]: {
    prev: statementType.IfStatementStart,
  },
};

export const useGetCurrentScope = () => {
  const statementList = useStatementList();

  return useRecoilCallback(({ snapshot }) => async (id: Statement['id']) => {
    const currentIndex = statementList.findIndex((stmt) => stmt.id === id);
    if (currentIndex === -1) return [];

    const currentStmt = await snapshot.getPromise(statementsState(id));
    const { next: nextPair, prev: prevPair } = statementPair[currentStmt._type];
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
        } else if (
          stmt.indent === targetScopeIndent &&
          stmt._type === nextPair
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
        } else if (
          stmt.indent === targetScopeIndent &&
          stmt._type === prevPair
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
  const insertNextStatement = useRecoilCallback(
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

  const insertPrevStatement = useRecoilCallback(
    ({ snapshot }) =>
      async (
        afterStatementId: Statement['id'] | undefined,
        newStmts: Statement[]
      ) => {
        const stmts = await snapshot.getPromise(statementListState);
        const index = stmts.findIndex((stmt) => stmt.id === afterStatementId);
        if (index <= 0) return;

        insertNextStatement(stmts[index - 1].id, newStmts);
      },
    []
  );

  return { insertNextStatement, insertPrevStatement };
};

export const useStatementList = () => {
  return useRecoilValue(statementListState);
};

type EditorStatement = {
  lineNumber: number;
  statement: ListStatementItem;
};

export const useEditorStatements = () => {
  const statementList = useStatementList();
  const { insertNextStatement } = useInsertStatement();

  return useMemo(() => {
    let declarative: EditorStatement[] = [];
    let imperative: EditorStatement[] = [];

    let index = statementList.findIndex(
      (item) => item._type !== 'LetStatement'
    );

    if (index === 0) {
      insertNextStatement(undefined, [
        createLetStatement({ type: '', varNames: [''] }),
      ]);
    }

    if (index === -1) {
      insertNextStatement(statementList.at(-1)?.id, [
        createNewStatement({ indent: 0 }),
      ]);
    }

    if (index === -1) {
      index = statementList.length;
    }

    declarative = statementList
      .slice(0, index)
      .map((item, i) => ({ lineNumber: i + 1, statement: item }));
    imperative = statementList
      .slice(index)
      .map((item, i) => ({ lineNumber: index + i + 1, statement: item }));

    return {
      declarative,
      imperative,
    };
  }, [statementList]);
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

function useFirstRender() {
  const ref = useRef(true);

  if (ref.current) {
    ref.current = false;
    return true;
  }

  return ref.current;
}

export const useNode = <T extends Node>(id: T['id']) => {
  const [node, setNode] = useRecoilState(nodesState(id));
  const nextNode = useRecoilValue(nextNodeState(id));
  const prevNode = useRecoilValue(prevNodeState(id));
  const isFirstRendering = useFirstRender();

  const ref = useCallback(
    (element: HTMLDivElement | null) => {
      if (!element || !isFirstRendering) return;
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
    node: node as T,
    setNode,
    ref,
    moveNextNode,
    movePrevNode,
    moveCurrentNodeLast,
  };
};
