import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { styled } from '@mui/material';
import {
  ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';

import { hexToRgba } from '@/styles/utils';

type CompleteOptionItem = {
  displayName: string;
  keyword: string[];
  onComplete?: () => void;
};

type CompleteOptionRoot = {
  displayName: string;
  completeOptions: CompleteOption[];
  onComplete?: () => void;
};

export type CompleteOption = CompleteOptionItem | CompleteOptionRoot;
type AddDisplayOption<T> = T & {
  focused: boolean;
};

type DisplayCompleteOptionItem = AddDisplayOption<CompleteOptionItem>;
type DisplayCompleteOptionRoot = Omit<
  AddDisplayOption<CompleteOptionRoot>,
  'completeOptions'
> & {
  completeOptions: DisplayCompleteOption[];
};

export type DisplayCompleteOption =
  | DisplayCompleteOptionItem
  | DisplayCompleteOptionRoot;

const CmpMenu = styled('div')<{ top: number; left: number }>(
  ({ theme, top, left }) => ({
    display: 'flex',
    flexDirection: 'column',
    margin: 0,
    padding: '4px 2px',
    zIndex: 1,
    position: 'absolute',
    top,
    left,
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
  })
);

const CmpMenuFooter = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  margin: '4px -2px -4px',
  padding: '4px 8px',
  fontSize: '0.5em',
  backgroundColor: hexToRgba(theme.background[900], 0.8),
  color: theme.background.contrast[900],
  kbd: {
    padding: '0 4px',
    backgroundColor: theme.background[600],
    color: theme.background.contrast[600],
  },
}));

const StyledCmpMenuItem = styled('div')<{ focused: number }>(
  ({ theme, focused }) => {
    const activeStyle = {
      backgroundColor: theme.background[700],
      color: theme.background.contrast[700],
    };

    return {
      padding: '2px 8px',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      textAlign: 'start',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '4px',
      '&:hover, &:active': activeStyle,
      ...(focused ? activeStyle : {}),
      svg: {
        marginRight: '-8px',
        color: theme.primary[300],
      },
    };
  }
);

const isMatchKeywords = (keyword: string, option: CompleteOptionItem) => {
  if (keyword === '') return true;
  return option.keyword.some((_) => _.includes(keyword));
};

export const isCompleteOptionItem = (
  option: CompleteOption
): option is CompleteOptionItem => {
  return !isCompleteOptionRoot(option);
};

export const isCompleteOptionRoot = (
  option: CompleteOption
): option is CompleteOptionRoot => {
  return 'completeOptions' in option;
};

export const isDisplayCompleteOptionRoot = (
  option: DisplayCompleteOption
): option is DisplayCompleteOptionRoot => {
  return 'completeOptions' in option;
};

export const filterCompleteOptions = (
  keyword: string,
  options: CompleteOption[]
): DisplayCompleteOption[] => {
  const trimmed = keyword.trim();

  const results: DisplayCompleteOption[] = [];

  options.forEach((option) => {
    if (isCompleteOptionItem(option) && isMatchKeywords(trimmed, option)) {
      return results.push({ ...option, focused: false });
    }

    if (isCompleteOptionRoot(option)) {
      const filteredChildrenOptions = filterCompleteOptions(
        trimmed,
        option.completeOptions
      );
      if (filteredChildrenOptions.length > 0) {
        results.push({
          ...option,
          completeOptions: filteredChildrenOptions,
          focused: false,
        });
      }
    }
  });

  return results;
};

const CmpMenuItem: React.FC<
  {
    option: DisplayCompleteOption;
    closeCompleteMenu: () => void;
    onSelectCompleteItem: (option: CompleteOption) => void;
    nestLevel: number;
  } & ComponentProps<'div'>
> = ({
  option,
  closeCompleteMenu,
  onSelectCompleteItem,
  nestLevel,
  ...rest
}) => {
  const [position, setPosition] = useState<
    { top: number; right: number } | undefined
  >(undefined);

  const handleSetPosition = (el: HTMLDivElement) => {
    const rect = el?.getBoundingClientRect();
    if (!rect?.top || !rect?.right) return;
    if (!position) {
      setPosition({ top: rect.top, right: rect.right });
      return;
    }

    if (position.top === rect.top && position.right === rect.right) return;

    setPosition({ top: rect.top, right: rect.right });
  };

  return (
    <>
      <StyledCmpMenuItem
        focused={+option.focused}
        ref={handleSetPosition}
        {...rest}
      >
        {option.displayName}
        {isCompleteOptionRoot(option) && <KeyboardArrowRightIcon />}
      </StyledCmpMenuItem>
      {option.focused && isCompleteOptionRoot(option) && position && (
        <CompleteMenuRoot
          top={position.top - 4}
          left={position.right + 8}
          nestLevel={nestLevel + 1}
          options={option.completeOptions}
          onSelectCompleteItem={onSelectCompleteItem}
          closeCompleteMenu={closeCompleteMenu}
        />
      )}
    </>
  );
};

const CompleteMenuRoot: React.FC<{
  top: number;
  left: number;
  options: DisplayCompleteOption[];
  closeCompleteMenu: () => void;
  onSelectCompleteItem: (option: CompleteOption) => void;
  nestLevel: number;
}> = ({
  top,
  left,
  options,
  closeCompleteMenu,
  onSelectCompleteItem,
  nestLevel,
}) => {
  return ReactDOM.createPortal(
    <CmpMenu top={top} left={left}>
      {options.map((option, i) => (
        <CmpMenuItem
          key={i}
          option={option}
          nestLevel={nestLevel}
          onMouseDown={() => {
            onSelectCompleteItem(option);
            closeCompleteMenu();
          }}
          onClick={() => {
            onSelectCompleteItem(option);
            closeCompleteMenu();
          }}
          onSelectCompleteItem={onSelectCompleteItem}
          closeCompleteMenu={closeCompleteMenu}
        />
      ))}
      {nestLevel === 0 && (
        <CmpMenuFooter>
          <kbd>ESC</kbd>
          <span>で閉じる</span>
        </CmpMenuFooter>
      )}
    </CmpMenu>,
    document.body
  );
};

type UpdateDisplayCompleteOptionCmd = {
  targetIndex: number;
  parentIndexs: number[];
  newValue: Partial<DisplayCompleteOption>;
};

const generateNewDisplayCompleteOption = (
  displayOptions: DisplayCompleteOption[],
  updateCmds: UpdateDisplayCompleteOptionCmd[]
) => {
  updateCmds.forEach((cmd) => {
    if (cmd.parentIndexs.length === 0) {
      displayOptions[cmd.targetIndex] = {
        ...displayOptions[cmd.targetIndex],
        ...cmd.newValue,
      };
    } else if (cmd.parentIndexs.length > 0) {
      const index = cmd.parentIndexs[0];
      const targetOption = displayOptions[index];
      if (isDisplayCompleteOptionRoot(targetOption)) {
        const newCompleteOptions = generateNewDisplayCompleteOption(
          targetOption.completeOptions,
          [{ ...cmd, parentIndexs: cmd.parentIndexs.slice(1) }]
        );

        displayOptions[index] = {
          ...displayOptions[index],
          completeOptions: newCompleteOptions,
        };
      }
    }
  });

  return displayOptions;
};

const getCurrentSelectOption = (displayOptions: DisplayCompleteOption[]) => {
  const focusOptions: {
    option: DisplayCompleteOption;
    currentScopeOptions: DisplayCompleteOption[];
    index: number;
    parentIndexs: number[];
  }[] = [];

  const _filterDisplayOptions = (
    options: DisplayCompleteOption[],
    parentIndexs: number[]
  ) => {
    options.forEach((option, i) => {
      if (option.focused) {
        focusOptions.push({
          option,
          currentScopeOptions: options,
          index: i,
          parentIndexs,
        });
      }
      if (isDisplayCompleteOptionRoot(option)) {
        _filterDisplayOptions(option.completeOptions, parentIndexs.concat(i));
      }
    });
  };

  _filterDisplayOptions(displayOptions, []);

  return focusOptions
    .sort((a, b) => b.parentIndexs.length - a.parentIndexs.length)
    .at(0);
};

export const useCompleteMenu = (
  completeOptions: CompleteOption[],
  inputValue: string,
  delay = 800
) => {
  const [displayOptions, setDisplayOptions] = useState<DisplayCompleteOption[]>(
    []
  );
  const enableComplete = useRef(false);
  const menuTimer = useRef<ReturnType<typeof setTimeout>>();

  const updateCompleteMenu = useCallback(
    (value: string) => {
      if (!completeOptions) {
        return;
      }

      if (!enableComplete.current) {
        return;
      }

      menuTimer.current = setTimeout(() => {
        setDisplayOptions(filterCompleteOptions(value, completeOptions));
      }, delay);
    },
    [completeOptions, setDisplayOptions]
  );

  const openCompleteMenu = useCallback(() => {
    if (enableComplete.current) return;

    enableComplete.current = true;
    updateCompleteMenu(inputValue);
  }, [inputValue]);

  const closeCompleteMenu = useCallback(() => {
    enableComplete.current = false;
    clearTimeout(menuTimer.current);
    setDisplayOptions([]);
  }, [setDisplayOptions]);

  const selectNextCompleteItem = useCallback(() => {
    const currentSelectOption = getCurrentSelectOption(displayOptions);
    if (!currentSelectOption) {
      setDisplayOptions((cur) => {
        if (cur.length === 0) return cur;

        cur[0].focused = true;
        return [...cur];
      });

      return;
    }

    const currentScopeLength = currentSelectOption.currentScopeOptions.length;
    const isLast = currentScopeLength === currentSelectOption.index + 1;
    const updateCmds: UpdateDisplayCompleteOptionCmd[] = [
      {
        targetIndex: currentSelectOption.index,
        parentIndexs: currentSelectOption.parentIndexs,
        newValue: {
          focused: false,
        },
      },
      {
        targetIndex: isLast ? 0 : currentSelectOption.index + 1,
        parentIndexs: currentSelectOption.parentIndexs,
        newValue: {
          focused: true,
        },
      },
    ];

    setDisplayOptions((cur) => [
      ...generateNewDisplayCompleteOption(cur, updateCmds),
    ]);
  }, [displayOptions]);

  const selectPrevCompleteItem = useCallback(() => {
    const currentSelectOption = getCurrentSelectOption(displayOptions);
    if (!currentSelectOption) {
      setDisplayOptions((cur) => {
        if (cur.length === 0) return cur;

        cur[cur.length - 1].focused = true;
        return [...cur];
      });

      return;
    }

    const isFirst = currentSelectOption.index === 0;
    const updateCmds: UpdateDisplayCompleteOptionCmd[] = [
      {
        targetIndex: currentSelectOption.index,
        parentIndexs: currentSelectOption.parentIndexs,
        newValue: {
          focused: false,
        },
      },
      {
        targetIndex: isFirst
          ? currentSelectOption.currentScopeOptions.length - 1
          : currentSelectOption.index - 1,
        parentIndexs: currentSelectOption.parentIndexs,
        newValue: {
          focused: true,
        },
      },
    ];

    setDisplayOptions((cur) => [
      ...generateNewDisplayCompleteOption(cur, updateCmds),
    ]);
  }, [displayOptions]);

  const selectChildrenMenu = useCallback(() => {
    const currentOption = getCurrentSelectOption(displayOptions);
    if (!currentOption) return;
    if (!isDisplayCompleteOptionRoot(currentOption.option)) return;

    setDisplayOptions((cur) => [
      ...generateNewDisplayCompleteOption(cur, [
        {
          targetIndex: 0,
          parentIndexs: currentOption.parentIndexs.concat([
            currentOption.index,
          ]),
          newValue: {
            focused: true,
          },
        },
      ]),
    ]);
  }, [displayOptions]);

  const selectParentMenu = useCallback(() => {
    const currentOption = getCurrentSelectOption(displayOptions);
    if (!currentOption) return;
    if (!hasParentMenu()) return;

    setDisplayOptions((cur) => [
      ...generateNewDisplayCompleteOption(cur, [
        {
          targetIndex: currentOption.index,
          parentIndexs: currentOption.parentIndexs,
          newValue: {
            focused: false,
          },
        },
      ]),
    ]);
  }, [displayOptions]);

  const clickCurrentCompleteItem = useCallback(
    (callback: (option: CompleteOption) => void) => {
      const currentOption = getCurrentSelectOption(displayOptions)?.option;
      if (!currentOption) return;
      callback(currentOption);
    },
    [displayOptions]
  );

  const isOpen = useMemo(() => {
    return displayOptions.length > 0;
  }, [displayOptions.length]);

  const hasChildrenMenu = useCallback(() => {
    const currentOption = getCurrentSelectOption(displayOptions);
    if (!currentOption) return false;

    return isDisplayCompleteOptionRoot(currentOption.option);
  }, [displayOptions]);

  const hasParentMenu = useCallback(() => {
    const currentOption = getCurrentSelectOption(displayOptions);
    if (!currentOption) return false;

    return currentOption.parentIndexs.length > 0;
  }, [displayOptions]);

  useEffect(() => {
    if (enableComplete.current) {
      updateCompleteMenu(inputValue);
    }

    return () => clearTimeout(menuTimer.current);
  }, [inputValue]);

  const CompleteMenu: React.FC<{
    onSelectCompleteItem: (option: CompleteOption) => void;
    top: number;
    left: number;
  }> = ({ onSelectCompleteItem, top, left }) => {
    if (!isOpen) return null;

    return (
      <CompleteMenuRoot
        top={top}
        left={left}
        nestLevel={0}
        options={displayOptions}
        onSelectCompleteItem={onSelectCompleteItem}
        closeCompleteMenu={closeCompleteMenu}
      />
    );
  };

  return {
    displayOptions,
    CompleteMenu,
    openCompleteMenu,
    closeCompleteMenu,
    hasChildrenMenu,
    hasParentMenu,
    selectNextCompleteItem,
    selectPrevCompleteItem,
    selectChildrenMenu,
    selectParentMenu,
    isOpen,
    clickCurrentCompleteItem,
  };
};
