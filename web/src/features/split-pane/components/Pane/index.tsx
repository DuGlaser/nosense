import { styled } from '@mui/material';
import { PANE_DEFAULT_VALUE_EFFECT_KEY, usePaneValue } from '@split-pane/store';
import { ComponentProps, PropsWithChildren } from 'react';
import { RecoilSync } from 'recoil-sync';

export type PaneProps = ComponentProps<'div'> & {
  id: string;
  defaultHeight?: number;
  maxHeight?: number;
  minHeight?: number;
};

type PaneInnerProps = {
  id: PaneProps['id'];
};

const FlexItem = styled('div')<{ height: number | 'auto' }>(({ height }) => {
  const h =
    typeof height === 'number'
      ? {
          height: height,
        }
      : {
          flex: 1,
        };

  return {
    ...h,
    overflow: 'auto',
  };
});

const PaneInner: React.FC<PropsWithChildren<PaneInnerProps>> = ({
  id,
  children,
}) => {
  const paneState = usePaneValue(id);
  return <FlexItem height={paneState.height}>{children}</FlexItem>;
};

export const Pane: React.FC<PropsWithChildren<PaneProps>> = ({
  id: id,
  children,
  defaultHeight,
  maxHeight,
  minHeight,
}) => {
  const height = defaultHeight ?? 'auto';

  return (
    <RecoilSync
      storeKey={PANE_DEFAULT_VALUE_EFFECT_KEY}
      read={(id) => {
        return {
          id,
          height,
          maxHeight,
          minHeight,
          isLock: false,
        };
      }}
    >
      <PaneInner id={id}>{children}</PaneInner>
    </RecoilSync>
  );
};
