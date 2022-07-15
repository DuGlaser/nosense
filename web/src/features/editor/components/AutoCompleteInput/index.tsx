import { Box, styled, SxProps, Theme } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';

const EditableDiv = styled('div')(() => ({
  border: 'none',
  minWidth: '5px',
  '&:focus': {
    outline: '0px solid transparent',
  },
}));

export type CompleteOption = {
  displayName: string;
  keyword: string[];
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

const Listbox = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  margin: 0,
  padding: 0,
  zIndex: 1,
  position: 'absolute',
  listStyle: 'none',
  backgroundColor: theme.background[800],
  color: theme.background.contrast[800],
  overflow: 'auto',
  maxHeight: 200,
  '& div': {
    padding: '2px 8px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    '&:hover, &:active': {
      backgroundColor: theme.background[700],
      color: theme.background.contrast[700],
    },
  },
}));

type Props = {
  defaultValue: string;
  options?: CompleteOption[];
  sx?: SxProps<Theme>;
  onChange?: (newValue: string) => void;
};

// TODO: ショートカットを用意する
export const AutocompleteInput: FC<Props> = ({
  defaultValue,
  sx = [],
  options,
  onChange,
}) => {
  const [value, setValue] = useState(defaultValue);
  const [displayValue, setDisplayValue] = useState(defaultValue);
  const [displayOptions, setDisplayOptions] = useState<
    CompleteOption[] | undefined
  >(undefined);
  const enableComplete = useRef(false);

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

    setDisplayOptions(filterCompleteOptions(value, options));
  };

  const handleUpdateValue = (value: string) => {
    setValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  const handleCloseCompleteMenu = () => {
    enableComplete.current = false;
    setDisplayOptions(undefined);
  };

  const selectCompleteItem = (value: string) => {
    setDisplayValue(value);
    handleUpdateValue(value);
    handleCloseCompleteMenu();
  };

  useEffect(() => {
    updateDisplayOption(value, options);
  }, [value, defaultValue]);

  return (
    <Box
      sx={{
        position: 'relative',
      }}
    >
      <EditableDiv
        sx={[...(Array.isArray(sx) ? sx : [sx])]}
        contentEditable
        suppressContentEditableWarning={true}
        onInput={(e) => {
          const target = e.target as HTMLDivElement;
          handleUpdateValue(target.innerText);
        }}
        onBlur={handleCloseCompleteMenu}
        onFocus={() => {
          enableComplete.current = true;
          updateDisplayOption(value, options);
        }}
      >
        {displayValue}
      </EditableDiv>
      {displayOptions && displayOptions?.length > 0 && (
        <Listbox>
          {displayOptions.map((option) => (
            <div
              key={option.displayName}
              onMouseDown={(e) => {
                const target = e.target as HTMLDivElement;
                selectCompleteItem(target.innerText);
              }}
            >
              {option.displayName}
            </div>
          ))}
        </Listbox>
      )}
    </Box>
  );
};
