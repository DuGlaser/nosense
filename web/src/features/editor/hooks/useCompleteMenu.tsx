import { styled } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { hexToRgba } from '@/styles/utils';

export type CompleteOption = {
  displayName: string;
  keyword: string[];
  onComplete?: () => void;
};

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

const CmpMenuItem = styled('div')<{ focused: number }>(({ theme, focused }) => {
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
});

const filterCompleteOptions = (keyword: string, options: CompleteOption[]) => {
  const trimmed = keyword.trim();

  if (trimmed === '') {
    return options;
  }

  return options.filter((option) =>
    option.keyword.some((_) => _.includes(trimmed))
  );
};

export const useCompleteMenu = (
  completeOptions: CompleteOption[],
  inputValue: string,
  delay = 200
) => {
  const [displayOptions, setDisplayOptions] = useState<CompleteOption[]>([]);
  const [selectMenuItemIndex, setSelectMenuItemIndex] = useState<number>(0);
  const enableComplete = useRef(false);
  const menuItemRefs = useRef<HTMLDivElement[]>([]);
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
    setSelectMenuItemIndex(0);
    updateCompleteMenu(inputValue);
  }, [setSelectMenuItemIndex, inputValue]);

  const closeCompleteMenu = useCallback(() => {
    enableComplete.current = false;
    setSelectMenuItemIndex(0);
    clearTimeout(menuTimer.current);
    setDisplayOptions([]);
  }, [setSelectMenuItemIndex]);

  const selectNextCompletItem = useCallback(() => {
    setSelectMenuItemIndex((cur) =>
      cur + 1 === menuItemRefs.current.length ? 0 : cur + 1
    );
  }, [setSelectMenuItemIndex]);

  const selectPrevCompletItem = useCallback(() => {
    setSelectMenuItemIndex((cur) =>
      cur === 0 ? menuItemRefs.current.length - 1 : cur - 1
    );
  }, [setSelectMenuItemIndex]);

  const clickCurrentCompleteItem = useCallback(() => {
    menuItemRefs.current[selectMenuItemIndex].click();
  }, [selectMenuItemIndex]);

  const displayedCompleteMenu = useMemo(() => {
    return displayOptions.length > 0;
  }, [displayOptions.length]);

  useEffect(() => {
    if (enableComplete.current) {
      updateCompleteMenu(inputValue);
    }

    return () => clearTimeout(menuTimer.current);
  }, [inputValue]);

  useEffect(() => {
    setSelectMenuItemIndex(0);
  }, [displayOptions.length]);

  const CompleteMenu: React.FC<{
    onSelectCompleteItem: (option: CompleteOption) => void;
  }> = ({ onSelectCompleteItem }) => {
    if (!displayedCompleteMenu) return null;

    return (
      <CmpMenu>
        {displayOptions.map((option, i) => (
          <CmpMenuItem
            focused={+(selectMenuItemIndex === i)}
            ref={(el) => {
              if (!el) return;
              if (i === 0) menuItemRefs.current = [];

              menuItemRefs.current.push(el);
            }}
            key={option.displayName}
            onMouseDown={() => {
              onSelectCompleteItem(option);
              closeCompleteMenu();
            }}
            onClick={() => {
              onSelectCompleteItem(option);
              closeCompleteMenu();
            }}
          >
            {option.displayName}
          </CmpMenuItem>
        ))}
      </CmpMenu>
    );
  };

  return {
    CompleteMenu,
    openCompleteMenu,
    closeCompleteMenu,
    selectNextCompletItem,
    selectPrevCompletItem,
    displayedCompleteMenu,
    clickCurrentCompleteItem,
  };
};
