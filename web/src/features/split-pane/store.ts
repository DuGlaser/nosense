import {
  bool,
  literal,
  nullable,
  number,
  object,
  string,
  union,
} from '@recoiljs/refine';
import { useCallback } from 'react';
import {
  atomFamily,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { syncEffect } from 'recoil-sync';

import { useTimeoutTransition } from '@/hooks';

type PaneState = {
  id: string;
  height: number | 'auto';
  maxHeight: number | null | undefined;
  minHeight: number | null | undefined;
  isLock: boolean;
  resizing: boolean;
};

export const PANE_DEFAULT_VALUE_EFFECT_KEY = 'paneDefaultValueEffect';

export const panesState = atomFamily<PaneState, PaneState['id']>({
  key: 'panes',
  effects: (id) => [
    syncEffect({
      storeKey: PANE_DEFAULT_VALUE_EFFECT_KEY,
      refine: object({
        id: string(),
        height: union(number(), literal('auto')),
        maxHeight: nullable(number()),
        minHeight: nullable(number()),
        isLock: bool(),
        resizing: bool(),
      }),
      read: ({ read }) => read(id),
    }),
  ],
});

const calcHeight = (
  currentHeight: number,
  diff: number,
  { maxHeight, minHeight }: Pick<PaneState, 'maxHeight' | 'minHeight'>
) => {
  let newHeight = currentHeight + diff;
  if (typeof maxHeight === 'number') {
    newHeight = Math.min(maxHeight, newHeight);
  }

  if (typeof minHeight === 'number') {
    newHeight = Math.max(minHeight, newHeight);
  }

  return newHeight;
};

export const usePaneValue = (id: PaneState['id']) => {
  return useRecoilValue(panesState(id));
};

export const usePane = (id: PaneState['id']) => {
  const [paneState, setPaneState] = useRecoilState(panesState(id));

  const setSize = useCallback(
    (height: 'min' | 'max' | number) => {
      switch (height) {
        case 'min':
          setPaneState((cur) => ({
            ...cur,
            height: cur.minHeight ?? cur.height,
          }));
          break;

        case 'max':
          setPaneState((cur) => ({
            ...cur,
            height: cur.maxHeight ?? cur.height,
          }));
          break;

        default:
          setPaneState((cur) => ({
            ...cur,
            height: height,
          }));
      }
    },
    [id, paneState, setPaneState]
  );

  return { setSize, paneState };
};

export const useCalcPaneHeight = (id: PaneState['id']) => {
  const { startTransition } = useTimeoutTransition();

  return useRecoilCallback(
    ({ set }) =>
      async (diff: number) => {
        set(panesState(id), (cur) => ({ ...cur, resizing: true }));
        set(panesState(id), (cur) => {
          const { maxHeight, minHeight } = cur;
          return {
            ...cur,
            height:
              cur.height === 'auto'
                ? cur.height
                : calcHeight(cur.height, diff, { maxHeight, minHeight }),
          };
        });

        startTransition(() => {
          set(panesState(id), (cur) => ({ ...cur, resizing: false }));
        }, 500);
      },
    [id]
  );
};
