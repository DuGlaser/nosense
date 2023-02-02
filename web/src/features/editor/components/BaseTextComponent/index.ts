import { styled } from '@mui/material';

export const BaseTextComponent = styled('div')({
  border: 'none',
  padding: '1px 4px',
  '&:focus': {
    outline: '0px solid transparent',
  },
});
