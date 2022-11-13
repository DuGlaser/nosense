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

const EditableDiv = styled('div')(() => ({
  border: 'none',
  minWidth: '5px',
  padding: '1px 4px',
  position: 'relative',
  '&:focus': {
    outline: '0px solid transparent',
  },
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
  maxHeight: 200,

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
  validate?: ValidateFn;
} & ComponentProps<'div'>;

export const EditableNodeComponent: React.FC<EditableNodeProps> = ({
  id,
  completeOptions = [],
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

    if (e.key === 'ArrowLeft' && selection?.focusOffset === 0) {
      movePrevNode();
      e.preventDefault();
      return;
    }

    if (e.key === 'Tab') {
      moveNextNode();
      e.preventDefault();
      return;
    }

    if (e.key === 'Backspace' && selection?.focusOffset === 0) {
      movePrevNode();
      e.preventDefault();
      return;
    }

    if (e.key === 'ArrowRight' && selection?.focusOffset === value.length) {
      moveNextNode();
      e.preventDefault();
      return;
    }

    if (e.key === 'Escape' && enableComplete.current) {
      handleCloseCompleteMenu();
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
