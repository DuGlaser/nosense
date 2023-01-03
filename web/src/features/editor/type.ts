import { KeyboardEvent } from 'react';

import { BaseStatement } from '@/lib/models/editorObject';

export type StatementComponentProps = {
  id: BaseStatement['id'];
  active: boolean;
};

const cursorPosition = ['START', 'END'] as const;
export type CursorPosition = typeof cursorPosition[number];

export type InputEvent = {
  key: string;
  contentLength?: number;
  cursorPosition?: CursorPosition;
  openCompleteMenu?: boolean;
  callback: (e: KeyboardEvent<HTMLDivElement>, next: () => void) => void;
};
