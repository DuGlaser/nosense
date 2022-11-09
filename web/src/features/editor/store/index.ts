import { Node, Statement } from '@editor/lib';
import { useCallback } from 'react';
import {
  atom,
  atomFamily,
  selectorFamily,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

type AtomStatement<T extends Statement> = Omit<T, 'nodes'> & {
  nodes: Node['id'][];
};

const statementsState = atomFamily<AtomStatement<Statement>, Statement['id']>({
  key: 'statements',
});

const statementListState = atom<Pick<Statement, 'id' | '_type'>[]>({
  key: 'statementList',
  default: [],
});

const nodesState = atomFamily<Node, Node['id']>({
  key: 'nodes',
});

const nodeListState = atom<Pick<Node, 'id' | '_type'>[]>({
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
            return {
              ...cur,
              nodes: [...left, newNode.id, ...right],
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
          return [...left, { id: newNode.id, _type: newNode._type }, ...right];
        });
      },
    [statementId]
  );
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

export const useInsertStatement = () => {
  return useRecoilCallback(
    ({ set, snapshot }) =>
      async (
        beforeStatementId: Statement['id'] | undefined,
        newStmt: Statement
      ) => {
        set(statementListState, (cur) => {
          const beforeStmtIndex = beforeStatementId
            ? cur.findIndex((stmt) => stmt.id === beforeStatementId)
            : -1;
          const left = cur.slice(0, beforeStmtIndex + 1);
          const right = cur.slice(beforeStmtIndex + 1);

          return [...left, { id: newStmt.id, _type: newStmt._type }, ...right];
        });

        set(statementsState(newStmt.id), {
          ...newStmt,
          nodes: newStmt.nodes.map((node) => node.id),
        });

        newStmt.nodes.map((node) => {
          set(nodesState(node.id), node);
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

          return [
            ...left,
            ...newStmt.nodes.map((node) => ({
              id: node.id,
              _type: node._type,
            })),
            ...right,
          ];
        });
      },
    []
  );
};

export const useStatementList = () => {
  return useRecoilValue(statementListState);
};

export const useNode = <T extends Node>(id: Node['id']) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [node, setNode] = useRecoilState<T>(nodesState(id));
  const nextNode = useRecoilValue(nextNodeState(id));
  const prevNode = useRecoilValue(prevNodeState(id));

  const ref = useCallback(
    (element: HTMLDivElement | null) => {
      if (!element || node.ref) return;
      setNode((cur) => ({ ...cur, ref: element }));
    },
    [id, setNode]
  );

  const moveNextNode = useRecoilCallback(
    () => async () => {
      nextNode?.ref?.focus();
    },
    [id, nextNode?.ref]
  );

  const movePrevNode = useRecoilCallback(
    () => async () => {
      const element = prevNode?.ref;
      if (!element) return;

      const textLength =
        element.childNodes.length > 0
          ? element.childNodes[0].textContent?.length ?? 0
          : 0;
      const range = document.createRange();

      const targetElement =
        element.childNodes.length > 0 ? element.childNodes[0] : element;
      // NOTE: 直前の要素の末尾に対してフォーカスを合わせる
      range.setStart(targetElement, textLength);

      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    },
    [id, prevNode?.ref]
  );

  return {
    node,
    setNode,
    ref,
    moveNextNode,
    movePrevNode,
  };
};
