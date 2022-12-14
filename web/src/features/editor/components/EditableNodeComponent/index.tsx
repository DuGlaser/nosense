import { BaseTextComopnent } from '@editor/components';
import { CompleteOption, useCompleteMenu } from '@editor/hooks';
import {
  useMoveNextStatement,
  useMovePrevStatement,
  useNode,
} from '@editor/store';
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

const cursorPosition = ['START', 'END'] as const;
type CursorPosition = typeof cursorPosition[number];

export type InputEvent = {
  key: string;
  contentLength?: number;
  cursorPosition?: CursorPosition;
  openCompleteMenu?: boolean;
  callback: (e: KeyboardEvent<HTMLDivElement>, next: () => void) => void;
};

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

const EditableDiv = styled(BaseTextComopnent)(() => ({
  minWidth: '5px',
  position: 'relative',
  '&[data-has-error="true"]': {
    textDecoration: 'underline',
    textDecorationStyle: 'wavy',
    textDecorationSkipInk: 'none',
    textDecorationColor: 'red',
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
} & ComponentProps<'div'>;

export const EditableNodeComponent = forwardRef<
  HTMLDivElement,
  EditableNodeProps
>(function EditableNodeComponent(
  { id, completeOptions = [], inputEvent = [], validate, ...rest },
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
    selectNextCompletItem,
    selectPrevCompletItem,
    displayedCompleteMenu,
    clickCurrentCompleteItem,
  } = useCompleteMenu(completeOptions, value);

  const handleUpdateValue = (value: string) => {
    const replaced = value.replace(/\r\n|\n/g, '');
    setValue(replaced);
    validate && setError(validate(replaced));
  };

  const selectCompleteItem = useCallback(
    (option: CompleteOption) => {
      flushSync(() => {
        setDisplayValue('');
      });
      setDisplayValue(option.displayName);
      handleUpdateValue(option.displayName);
      option.onComplete && option.onComplete();
      setTimeout(() => {
        moveCurrentNodeLast();
      }, 0);
    },
    [setDisplayValue, handleUpdateValue]
  );

  const handleUpdateNode = (newNode: EditableNode) => {
    setNode(newNode);
  };

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    handleUpdateNode({ ...node, content: value });
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
      openCompleteMenu: displayedCompleteMenu,
      cursorPosition: getCursorPosition(value, selection?.focusOffset),
    };

    if (execMatchInputEvent(event, inputEvent, e)) {
      e.preventDefault();
      return;
    }

    const editableNodeEvents: InputEvent[] = [
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
        callback: () => selectNextCompletItem(),
      },
      {
        key: 'ArrowUp',
        openCompleteMenu: true,
        callback: () => selectPrevCompletItem(),
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
        callback: () => clickCurrentCompleteItem(),
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
    ];

    if (execMatchInputEvent(event, editableNodeEvents, e)) {
      e.preventDefault();
      return;
    }
  };

  const handleInput = (e: FormEvent<HTMLDivElement>) => {
    openCompleteMenu();
    const target = e.target as HTMLDivElement;
    handleUpdateValue(target.innerText);
    rest.onInput && rest.onInput(e);
  };

  const handleFocus = (e: FocusEvent<HTMLDivElement>) => {
    openCompleteMenu();
    rest.onFocus && rest.onFocus(e);
  };

  return (
    <div>
      <EditableDiv
        data-node-label="editable"
        spellCheck={false}
        {...rest}
        // TODO: popupなどでもっとわかりやすくエラーを表示するようにする
        title={error?.message}
        data-has-error={!!error}
        ref={mergeRefs([ref, _ref])}
        contentEditable
        suppressContentEditableWarning={true}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onFocus={handleFocus}
      >
        {displayValue}
      </EditableDiv>
      <CompleteMenu onSelectCompleteItem={selectCompleteItem} />
    </div>
  );
});
