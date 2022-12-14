import {
  bool,
  literal,
  nullable,
  number,
  object,
  string,
  union,
} from '@recoiljs/refine';
import { atomFamily, useRecoilCallback, useRecoilValue } from 'recoil';
import { syncEffect } from 'recoil-sync';

type PaneState = {
  id: string;
  height: number | 'auto';
  maxHeight: number | null | undefined;
  minHeight: number | null | undefined;
  isLock: boolean;
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

export const useCalcPaneHeight = (id: PaneState['id']) => {
  return useRecoilCallback(
    ({ set }) =>
      async (diff: number) => {
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
      },
    [id]
  );
};
