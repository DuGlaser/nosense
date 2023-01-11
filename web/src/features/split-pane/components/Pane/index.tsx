import { PANE_DEFAULT_VALUE_EFFECT_KEY, usePaneValue } from '@split-pane/store';
import { motion } from 'framer-motion';
import { ComponentProps, PropsWithChildren, useMemo } from 'react';
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

const PaneInner: React.FC<PropsWithChildren<PaneInnerProps>> = ({
  id,
  children,
}) => {
  const paneState = usePaneValue(id);

  const sizeProps = useMemo(() => {
    return typeof paneState.height === 'number'
      ? {
          height: paneState.height,
        }
      : {
          flex: 1,
        };
  }, [paneState.height]);

  return (
    <motion.div
      transition={{
        duration: paneState.resizing ? 0 : 0.25,
        type: 'tween',
      }}
      style={{
        overflow: 'auto',
      }}
      initial={{
        ...sizeProps,
      }}
      animate={{
        ...sizeProps,
      }}
    >
      {children}
    </motion.div>
  );
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
          resizing: false,
        };
      }}
    >
      <PaneInner id={id}>{children}</PaneInner>
    </RecoilSync>
  );
};
