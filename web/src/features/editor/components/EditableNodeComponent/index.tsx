import { BaseTextComponent } from '@editor/components';
import {
  CompleteOption,
  isCompleteOptionRoot,
  useCompleteMenu,
} from '@editor/hooks';
import {
  useMoveNextStatement,
  useMovePrevStatement,
  useNode,
} from '@editor/store';
import { CursorPosition, InputEvent } from '@editor/type';
import { styled } from '@mui/material';
import {
  ComponentProps,
  FocusEvent,
  FormEvent,
  forwardRef,
  KeyboardEvent,
  useCallback,
  useState,
} from 'react';
import { flushSync } from 'react-dom';
import { mergeRefs } from 'react-merge-refs';

import { EditableNode } from '@/lib/models/editorObject';
import { useEditMode } from '@/store';

const equalInputEvent = (
  event: Omit<InputEvent, 'callback'>,
  target: InputEvent
): boolean => {
  if (event.key !== target.key) return false;
  if (
    target.contentLength !== undefined &&
    event.contentLength !== target.contentLength
  )
    return false;

  if (!!target.shiftKey !== !!event.shiftKey) return false;
  if (!!target.ctrlKey !== !!event.ctrlKey) return false;

  if (
    target.cursorPosition !== undefined &&
    event.cursorPosition !== target.cursorPosition
  )
    return false;

  if (
    target.openCompleteMenu !== undefined &&
    event.openCompleteMenu !== target.openCompleteMenu
  )
    return false;

  return true;
};

const execMatchInputEvent = (
  current: Omit<InputEvent, 'callback'>,
  events: InputEvent[],
  event: KeyboardEvent<HTMLDivElement>
): boolean => {
  for (const e of events) {
    let next = false;
    if (equalInputEvent(current, e)) {
      e.callback(event, () => {
        next = true;
      });

      if (!next) {
        return true;
      }
    }
  }

  return false;
};

const getCursorPosition = (
  content: string,
  offset: number | undefined
): CursorPosition | undefined => {
  if (offset === 0) return 'START';
  if (offset === content.length) return 'END';
  return undefined;
};

const EditableDiv = styled(BaseTextComponent)(() => ({
  minWidth: '5px',
  position: 'relative',
  '&[data-has-error="true"]': {
    textDecoration: 'underline',
    textDecorationStyle: 'wavy',
    textDecorationSkipInk: 'none',
    textDecorationColor: 'red',
  },
  '&[data-enable-placeholder="true"]::before': {
    content: 'attr(data-placeholder)',
    fontSize: '0.65em',
    opacity: 0.5,
    cursor: 'text',
  },
}));

export type ValidateError = {
  message: string;
};

export type ValidateFn = (value: string) => ValidateError | undefined;

export type EditableNodeProps = {
  id: EditableNode['id'];
  completeOptions?: CompleteOption[];
  inputEvent?: InputEvent[];
  validate?: ValidateFn;
  placeholder?: string;
} & ComponentProps<'div'>;

export const EditableNodeComponent = forwardRef<
  HTMLDivElement,
  EditableNodeProps
>(function EditableNodeComponent(
  {
    id,
    completeOptions = [],
    inputEvent = [],
    validate,
    placeholder: _placoholder,
    ...rest
  },
  _ref
) {
  const {
    node,
    setNode,
    moveNextNode,
    movePrevNode,
    moveCurrentNodeLast,
    ref,
  } = useNode<EditableNode>(id);
  const moveNextStatement = useMoveNextStatement();
  const movePrevStatement = useMovePrevStatement();
  const [value, setValue] = useState(node.content);
  const [position, setPosition] = useState<
    { bottom: number; left: number } | undefined
  >(undefined);
  const [mode] = useEditMode();

  /**
   * CompleteMenuで補完したときに入力を変更するためのState。
   * onChangeのときは更新しないようにする。
   * また、最新の値が入っているわけじゃないので参照しないようにする。
   */
  const [displayValue, setDisplayValue] = useState(node.content);
  const [error, setError] = useState<ValidateError | undefined>(() => {
    if (!validate) return undefined;
    if (node.content === '') return undefined;

    return validate(node.content);
  });

  const {
    openCompleteMenu,
    closeCompleteMenu,
    CompleteMenu,
    hasChildrenMenu,
    hasParentMenu,
    selectNextCompleteItem,
    selectPrevCompleteItem,
    selectChildrenMenu,
    selectParentMenu,
    isOpen,
    clickCurrentCompleteItem,
  } = useCompleteMenu(completeOptions, value);

  const handleUpdateValue = (value: string) => {
    const replaced = value.replace(/\r\n|\n/g, '');
    setValue(replaced);
    validate && setError(validate(replaced));
  };

  const selectCompleteItem = useCallback(
    (option: CompleteOption) => {
      if (isCompleteOptionRoot(option)) return;

      flushSync(() => {
        setDisplayValue('');
      });
      setDisplayValue(option.displayName);
      handleUpdateValue(option.displayName);
      option.onComplete && option.onComplete();
      closeCompleteMenu();
      setTimeout(() => {
        moveCurrentNodeLast();
      }, 0);
    },
    [setDisplayValue, handleUpdateValue]
  );

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    setNode((cur) => ({ ...cur, content: value }));
    closeCompleteMenu();
    validate && validate(value);
    rest.onBlur && rest.onBlur(e);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    rest.onKeyDown && rest.onKeyDown(e);
    const selection = window.getSelection();

    const event: Omit<InputEvent, 'callback'> = {
      key: e.key,
      contentLength: value.length,
      openCompleteMenu: isOpen,
      shiftKey: e.shiftKey,
      ctrlKey: e.ctrlKey,
      cursorPosition: getCursorPosition(value, selection?.focusOffset),
    };

    if (execMatchInputEvent(event, inputEvent, e)) {
      e.preventDefault();
      return;
    }

    const editableNodeEvents: InputEvent[] = [
      {
        key: 'ArrowLeft',
        callback: (_, next) => {
          if (hasParentMenu()) {
            return selectParentMenu();
          }
          next();
        },
      },
      {
        key: 'ArrowLeft',
        cursorPosition: 'START',
        callback: () => movePrevNode(),
      },
      {
        key: 'Backspace',
        cursorPosition: 'START',
        callback: () => movePrevNode(),
      },
      {
        key: 'ArrowRight',
        callback: (_, next) => {
          if (hasChildrenMenu()) {
            return selectChildrenMenu();
          }
          next();
        },
      },
      {
        key: 'ArrowRight',
        cursorPosition: 'END',
        callback: () => moveNextNode(),
      },
      {
        key: 'ArrowRight',
        contentLength: 0,
        callback: () => moveNextNode(),
      },
      {
        key: 'ArrowDown',
        openCompleteMenu: true,
        callback: () => selectNextCompleteItem(),
      },
      {
        key: 'ArrowUp',
        openCompleteMenu: true,
        callback: () => selectPrevCompleteItem(),
      },
      {
        key: 'ArrowDown',
        openCompleteMenu: false,
        callback: () => moveNextStatement(node.parentId),
      },
      {
        key: 'ArrowUp',
        openCompleteMenu: false,
        callback: () => movePrevStatement(node.parentId),
      },
      {
        key: 'Enter',
        openCompleteMenu: true,
        callback: () => clickCurrentCompleteItem(selectCompleteItem),
      },
      {
        key: 'Enter',
        callback: () => moveNextNode(),
      },
      {
        key: 'Enter',
        shiftKey: true,
        callback: () => movePrevNode(),
      },
      {
        key: 'Tab',
        callback: () => moveNextNode(),
      },
      {
        key: 'Escape',
        openCompleteMenu: true,
        callback: () => closeCompleteMenu(),
      },
      {
        key: 'Enter',
        callback: () => e.preventDefault(),
      },
      {
        key: 'Enter',
        shiftKey: true,
        callback: () => e.preventDefault(),
      },
    ];

    if (execMatchInputEvent(event, editableNodeEvents, e)) {
      e.preventDefault();
      return;
    }
  };

  const handleInput = (e: FormEvent<HTMLDivElement>) => {
    if (mode === 'READONLY' || !node.editable) {
      e.preventDefault();

      // IMEが有効な時は入力されてしまうため、初期値に戻すようにしている
      // 現在の値をセットすると再レンダリングが走らないので末尾にスペースをつけている
      flushSync(() => {
        setDisplayValue(node.content + ' ');
      });
      flushSync(() => {
        setDisplayValue(node.content);
      });

      return;
    }
    openCompleteMenu();
    const target = e.target as HTMLDivElement;
    handleUpdateValue(target.innerText);
    rest.onInput && rest.onInput(e);
  };

  const handleFocus = (e: FocusEvent<HTMLDivElement>) => {
    if (value === '') openCompleteMenu();
    rest.onFocus && rest.onFocus(e);
  };

  const placeholder = _placoholder ?? node.placeholder;

  return (
    <>
      <EditableDiv
        data-node-label="editable"
        data-enable-placeholder={placeholder && value === ''}
        data-placeholder={placeholder}
        spellCheck={false}
        {...rest}
        // TODO: popupなどでもっとわかりやすくエラーを表示するようにする
        title={error?.message}
        data-has-error={!!error}
        ref={mergeRefs([
          ref,
          _ref,
          (el) => {
            const rect = el?.getBoundingClientRect();
            if (!rect?.top || !rect?.right) return;
            if (!position) {
              setPosition({ bottom: rect.bottom, left: rect.left });
              return;
            }

            if (position.bottom === rect.bottom && position.left === rect.left)
              return;

            setPosition({ bottom: rect.bottom, left: rect.left });
          },
        ])}
        contentEditable={mode === 'WRITABLE'}
        suppressContentEditableWarning={true}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onFocus={handleFocus}
      >
        {displayValue}
      </EditableDiv>
      {position && (
        <CompleteMenu
          top={position.bottom}
          left={position.left}
          onSelectCompleteItem={selectCompleteItem}
        />
      )}
    </>
  );
});
