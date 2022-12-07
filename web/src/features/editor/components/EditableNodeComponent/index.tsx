import { BaseTextComopnent } from '@editor/components';
import { useNode } from '@editor/store';
import { styled } from '@mui/material';
import {
  ComponentProps,
  FocusEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import { EditableNode } from '@/lib/models/editorObject';
import { hexToRgba } from '@/styles/utils';

const cursorPosition = ['START', 'END'] as const;
type CursorPosition = typeof cursorPosition[number];

export type InputEvent = {
  key: string;
  contentLength?: number;
  cursorPosition?: CursorPosition;
  openCompleteMenu?: boolean;
  callback: (e: KeyboardEvent<HTMLDivElement>) => void;
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

  return true;
};

const matchInputEvent = (
  event: Omit<InputEvent, 'callback'>,
  events: InputEvent[]
): InputEvent | undefined => {
  for (const e of events) {
    if (equalInputEvent(event, e)) return e;
  }

  return undefined;
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

const CmpMenu = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  margin: 0,
  padding: '4px 2px',
  zIndex: 1,
  position: 'absolute',
  listStyle: 'none',
  backgroundColor: theme.background[800],
  color: theme.background.contrast[800],
  overflow: 'auto',
  maxHeight: '25vh',

  borderRadius: '2px',
  border: `1px solid ${theme.background[600]}`,
  boxShadow: `
  0px 0.2px 2px  ${hexToRgba(theme.background[900], 0.04)},
  0px 1px   5px  ${hexToRgba(theme.background[900], 0.06)},
  0px 5px   10px ${hexToRgba(theme.background[900], 0.8)}`,
}));

const CmpMenuItem = styled('div')(({ theme }) => ({
  padding: '2px 8px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  textAlign: 'start',
  '&:hover, &:active': {
    backgroundColor: theme.background[700],
    color: theme.background.contrast[700],
  },
}));

export type CompleteOption = {
  displayName: string;
  keyword: string[];
  onComplete?: () => void;
};

const filterCompleteOptions = (keyword: string, options: CompleteOption[]) => {
  const trimmed = keyword.trim();

  if (trimmed === '') {
    return options;
  }

  return options.filter((option) =>
    option.keyword.some((_) => _.includes(trimmed))
  );
};

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

export const EditableNodeComponent: React.FC<EditableNodeProps> = ({
  id,
  completeOptions = [],
  inputEvent = [],
  validate,
  ...rest
}) => {
  const { node, setNode, moveNextNode, movePrevNode, ref } =
    useNode<EditableNode>(id);
  const [value, setValue] = useState(node.content);

  /**
   * CompleteMenuで補完したときに入力を変更するためのState。
   * onChangeのときは更新しないようにする。
   * また、最新の値が入っているわけじゃないので参照しないようにする。
   */
  const [displayValue, setDisplayValue] = useState(node.content);
  const [displayOptions, setDisplayOptions] = useState<CompleteOption[]>([]);
  const [error, setError] = useState<ValidateError | undefined>(() => {
    if (!validate) return undefined;
    if (node.content === '') return undefined;

    return validate(node.content);
  });
  const enableComplete = useRef(false);
  const menuTimer = useRef<ReturnType<typeof setTimeout>>();

  const updateDisplayOption = (
    value: string,
    options: CompleteOption[] | undefined
  ) => {
    if (!options) {
      return;
    }

    if (!enableComplete.current) {
      return;
    }

    menuTimer.current = setTimeout(() => {
      setDisplayOptions(filterCompleteOptions(value, options));
    }, 200);
  };

  const handleUpdateValue = (value: string) => {
    const replaced = value.replace(/\r\n|\n/g, '');
    setValue(replaced);
    validate && setError(validate(replaced));
  };

  const handleCloseCompleteMenu = () => {
    enableComplete.current = false;
    clearTimeout(menuTimer.current);
    setDisplayOptions([]);
  };

  const selectCompleteItem = (option: CompleteOption) => {
    setDisplayValue(option.displayName);
    handleUpdateValue(option.displayName);
    handleCloseCompleteMenu();
    option.onComplete && option.onComplete();
  };

  const handleUpdateNode = (newNode: EditableNode) => {
    setNode(newNode);
  };

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    handleUpdateNode({ ...node, content: value });
    handleCloseCompleteMenu();
    validate && validate(value);
    rest.onBlur && rest.onBlur(e);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    rest.onKeyDown && rest.onKeyDown(e);
    const selection = window.getSelection();

    const event: Omit<InputEvent, 'callback'> = {
      key: e.key,
      contentLength: value.length,
      cursorPosition: getCursorPosition(value, selection?.focusOffset),
    };

    let matched = matchInputEvent(event, inputEvent);
    if (matched) {
      matched.callback(e);
      e.preventDefault();
      return;
    }

    const editableNodeEvents: InputEvent[] = [
      {
        key: 'ArrowLeft',
        cursorPosition: 'START',
        callback: () => {
          movePrevNode();
        },
      },
      {
        key: 'Backspace',
        cursorPosition: 'START',
        callback: () => {
          movePrevNode();
        },
      },
      {
        key: 'ArrowRight',
        cursorPosition: 'END',
        callback: () => {
          moveNextNode();
        },
      },
      {
        key: 'ArrowRight',
        contentLength: 0,
        callback: () => {
          moveNextNode();
        },
      },
      {
        key: 'Tab',
        callback: () => {
          moveNextNode();
        },
      },
      {
        key: 'Escape',
        callback: () => {
          if (enableComplete.current) {
            handleCloseCompleteMenu();
          }
        },
      },
      {
        key: 'Enter',
        callback: () => {
          e.preventDefault();
        },
      },
    ];

    matched = matchInputEvent(event, editableNodeEvents);
    if (matched) {
      matched.callback(e);
      e.preventDefault();
      return;
    }
  };

  const handleInput = (e: FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    handleUpdateValue(target.innerText);
    rest.onInput && rest.onInput(e);
  };

  const handleFocus = (e: FocusEvent<HTMLDivElement>) => {
    enableComplete.current = true;
    updateDisplayOption(value, completeOptions);
    rest.onFocus && rest.onFocus(e);
  };

  useEffect(() => {
    updateDisplayOption(value, completeOptions);

    return () => clearTimeout(menuTimer.current);
  }, [value]);

  return (
    <div>
      <EditableDiv
        data-node-label="editable"
        spellCheck={false}
        {...rest}
        // TODO: popupなどでもっとわかりやすくエラーを表示するようにする
        title={error?.message}
        data-has-error={!!error}
        ref={ref}
        contentEditable
        suppressContentEditableWarning={true}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onFocus={handleFocus}
      >
        {displayValue}
      </EditableDiv>
      {displayOptions.length > 0 && (
        <CmpMenu>
          {displayOptions.map((option) => (
            <CmpMenuItem
              key={option.displayName}
              onMouseDown={() => {
                selectCompleteItem(option);
              }}
            >
              {option.displayName}
            </CmpMenuItem>
          ))}
        </CmpMenu>
      )}
    </div>
  );
};
