import { styled } from '@mui/material';
import { useCalcPaneHeight } from '@split-pane/store';
import { MouseEvent, useRef } from 'react';

import { useTimeoutTransition } from '@/hooks';
import { hexToRgba } from '@/styles/utils';

const ResizeHandler = styled('div')(() => ({
  width: '100%',
  padding: '8px 0',
  cursor: 'row-resize',
}));

const Splitbar = styled('div')(({ theme }) => ({
  width: '100%',
  height: '4px',
  background: hexToRgba(theme.background[800], 0.8),
  cursor: 'row-resize',
}));

type ResizerProps = {
  prevPaneId: string;
  nextPaneId: string;
};

export const Resizer: React.FC<ResizerProps> = ({ prevPaneId, nextPaneId }) => {
  const startPosition = useRef<number>(0);
  const isDrag = useRef<boolean>(false);
  const calcPrevPaneHeight = useCalcPaneHeight(prevPaneId);
  const calcNextPaneHeight = useCalcPaneHeight(nextPaneId);
  const { startTransition } = useTimeoutTransition();

  const updatePaneHeight = (e: globalThis.MouseEvent) => {
    startTransition(() => {
      calcPrevPaneHeight(e.pageY - startPosition.current);
      calcNextPaneHeight(startPosition.current - e.pageY);
      startPosition.current = e.pageY;
    }, 0);
  };

  const detatchEvent = () => {
    window.removeEventListener('mousemove', updatePaneHeight);
    window.removeEventListener('mouseup', detatchEvent);
  };

  const attachEvent = () => {
    window.addEventListener('mousemove', updatePaneHeight);
    window.addEventListener('mouseup', detatchEvent);
  };

  return (
    <ResizeHandler
      onMouseDown={(e: MouseEvent<HTMLDivElement>) => {
        startPosition.current = e.pageY;
        isDrag.current = true;
        attachEvent();
        e.preventDefault();
      }}
    >
      <Splitbar />
    </ResizeHandler>
  );
};
