export const EDIT_MODES = ['WRITABLE', 'READONLY'] as const;
export type EditMode = (typeof EDIT_MODES)[number];

export const EDIT_MODE = {
  WRITABLE: 'WRITABLE',
  READONLY: 'READONLY',
} satisfies {
  [key in EditMode]: key;
};

export const EDITOR_MODES = ['NORMAL', 'DEBUG', 'EXEC'] as const;
export type EditorMode = (typeof EDITOR_MODES)[number];

export const EDITOR_MODE = {
  NORMAL: 'NORMAL',
  DEBUG: 'DEBUG',
  EXEC: 'EXEC',
} satisfies {
  [key in EditorMode]: key;
};
