import { styled } from '@mui/material';
import { PropsWithChildren } from 'react';

import { hexToRgba } from '@/styles/utils';

const Wrapper = styled('div')<{
  indent: number;
  active: number;
}>(({ theme, indent, active }) => {
  const heightRate = 1.75;

  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: '20px',
    lineHeight: `${heightRate}em`,
    maxHeight: `${heightRate}em`,
    height: `${heightRate}em`,
    minHeight: `${heightRate}em`,
    paddingLeft: `${1 * indent}em`,
    backgroundColor: active
      ? hexToRgba(theme.primary[300], 0.15)
      : 'transparent',
    '& :focus': {
      backgroundColor: hexToRgba(theme.background[300], 0.25),
    },
    '&:has(:focus)': {
      backgroundColor: hexToRgba(theme.background[300], 0.15),
    },
    '> :first-child:not(:has(div[data-node-label="cursor"]))': {
      marginLeft: '0.5em',
    },
  };
});

export const StatementWrapper: React.FC<
  PropsWithChildren<{
    indent: number;
    active: boolean;
  }>
> = ({ indent, active, children }) => {
  return (
    <Wrapper indent={indent} active={+active}>
      {children}
    </Wrapper>
  );
};
