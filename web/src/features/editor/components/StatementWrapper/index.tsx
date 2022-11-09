import { styled } from '@mui/material';
import { PropsWithChildren } from 'react';

import { hexToRgba } from '@/styles/utils';

const Wrapper = styled('div')<{ indent: number; needfrontspace: number }>(
  ({ theme, indent, needfrontspace }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: '20px',
    marginLeft: `calc(${1 * indent}em + ${needfrontspace ? 5 : 0}px)`,
    '& :focus': {
      backgroundColor: hexToRgba(theme.background[300], 0.2),
    },
  })
);

export const StatementWrapper: React.FC<
  PropsWithChildren<{ indent: number; needFrontSpace?: boolean }>
> = ({ indent, needFrontSpace = false, children }) => {
  return (
    <Wrapper needfrontspace={+needFrontSpace} indent={indent}>
      {children}
    </Wrapper>
  );
};
