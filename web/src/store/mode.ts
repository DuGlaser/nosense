import { literal, union } from '@recoiljs/refine';
import { useCallback } from 'react';
import { flushSync } from 'react-dom';
import { atom, useRecoilState } from 'recoil';
import { syncEffect } from 'recoil-sync';

import { EDIT_MODES, EditMode, EDITOR_MODES, EditorMode } from '@/type';

export const EDIT_MODE_STORE_KEY = 'editMode';

const editModeState = atom<EditMode>({
  key: EDIT_MODE_STORE_KEY,
  effects: [
    syncEffect({
      storeKey: EDIT_MODE_STORE_KEY,
      refine: union(...EDIT_MODES.map((_) => literal(_))),
    }),
  ],
});

export const useEditMode = () => {
  return useRecoilState(editModeState);
};

export const EDITOR_MODE_STORE_KEY = 'editorMode';

const editorModeState = atom<EditorMode>({
  key: 'editorMode',
  default: 'NORMAL',
  effects: [
    syncEffect({
      storeKey: EDITOR_MODE_STORE_KEY,
      refine: union(...EDITOR_MODES.map((_) => literal(_))),
    }),
  ],
});

export const useEditorMode = () => {
  const [editorMode, _setEditorMode] = useRecoilState(editorModeState);
  const [, setEditMode] = useEditMode();

  const setEditorMode = useCallback(
    (mode: EditorMode) => {
      switch (mode) {
        case 'EXEC':
        case 'DEBUG':
          setEditMode('READONLY');
          break;

        default:
          setEditMode('WRITABLE');
          break;
      }

      _setEditorMode(mode);
    },
    [_setEditorMode, setEditMode]
  );

  const setSyncEditorMode = useCallback(
    (mode: EditorMode) => {
      flushSync(() => setEditorMode(mode));
    },
    [setEditorMode]
  );

  return {
    editorMode,
    setEditorMode,
    setSyncEditorMode,
  };
};
