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
  compliteOptions: CompleteOption[];
  onComplete?: () => void;
};

export type CompleteOption = CompleteOptionItem | CompleteOptionRoot;
type AddDisplayOption<T> = T & {
  focused: boolean;
};

type DisplayCompleteOptionItem = AddDisplayOption<CompleteOptionItem>;
type DisplayCompleteOptionRoot = Omit<
  AddDisplayOption<CompleteOptionRoot>,
  'compliteOptions'
> & {
  compliteOptions: DisplayCompleteOption[];
};

type DisplayCompleteOption =
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
      '&:hover, &:active': activeStyle,
      ...(focused ? activeStyle : {}),
    };
  }
);

const isMatchKeywords = (keyword: string, option: CompleteOptionItem) => {
  if (keyword === '') return true;
  return option.keyword.some((_) => _.includes(keyword));
};

const isCompleteOptionItem = (
  option: CompleteOption
): option is CompleteOptionItem => {
  return 'keyword' in option;
};

const isCompleteOptionRoot = (
  option: CompleteOption
): option is CompleteOptionRoot => {
  return 'compliteOptions' in option;
};

const isDisplayCompleteOptionRoot = (
  option: DisplayCompleteOption
): option is DisplayCompleteOptionRoot => {
  return 'compliteOptions' in option;
};

export const filterCompleteOptions = (
  keyword: string,
  options: CompleteOption[]
): DisplayCompleteOption[] => {
  const trimmed = keyword.trim();

  const results: DisplayCompleteOption[] = [];

  options.forEach((option) => {
    if (isCompleteOptionItem(option) && isMatchKeywords(trimmed, option)) {
      results.push({ ...option, focused: false });
    }

    if (isCompleteOptionRoot(option)) {
      const filteredChildrenOptions = filterCompleteOptions(
        trimmed,
        option.compliteOptions
      );
      if (filteredChildrenOptions.length > 0) {
        results.push({
          ...option,
          compliteOptions: filteredChildrenOptions,
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
  } & ComponentProps<'div'>
> = ({ option, closeCompleteMenu, onSelectCompleteItem, ...rest }) => {
  const [position, setPosition] = useState<
    { top: number; right: number } | undefined
  >(undefined);

  return (
    <>
      <StyledCmpMenuItem
        focused={+option.focused}
        ref={(el) => {
          const rect = el?.getBoundingClientRect();
          if (!rect?.top || !rect?.right) return;
          if (!position) {
            setPosition({ top: rect.top, right: rect.right });
            return;
          }

          if (position.top === rect.top && position.right === rect.right)
            return;

          setPosition({ top: rect.top, right: rect.right });
        }}
        {...rest}
      >
        {option.displayName}
      </StyledCmpMenuItem>
      {option.focused && isCompleteOptionRoot(option) && position && (
        <CompleteMenuRoot
          top={position.top - 4}
          left={position.right + 8}
          options={option.compliteOptions}
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
}> = ({ top, left, options, closeCompleteMenu, onSelectCompleteItem }) => {
  return ReactDOM.createPortal(
    <CmpMenu top={top} left={left}>
      {options.map((option, i) => (
        <CmpMenuItem
          key={i}
          option={option}
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
          targetOption.compliteOptions,
          [{ ...cmd, parentIndexs: cmd.parentIndexs.slice(1) }]
        );

        displayOptions[index] = {
          ...displayOptions[index],
          compliteOptions: newCompleteOptions,
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
        _filterDisplayOptions(option.compliteOptions, parentIndexs.concat(i));
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
  delay = 500
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

  const selectNextCompletItem = useCallback(() => {
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

  const selectPrevCompletItem = useCallback(() => {
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

      currentOption.onComplete && currentOption.onComplete();
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
    selectNextCompletItem,
    selectPrevCompletItem,
    selectChildrenMenu,
    selectParentMenu,
    isOpen,
    clickCurrentCompleteItem,
  };
};
