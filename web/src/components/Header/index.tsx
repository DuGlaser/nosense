import { styled } from '@mui/material';

import { PlayButton } from './PlayButton';
import { SharePopover } from './SharePopover';

const Wrapper = styled('div')(({ theme }) => ({
  width: '100%',
  padding: '10px 24px',
  height: '60px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: theme.background[800],
}));

const Logo = styled('div')(({ theme }) => ({
  background: `linear-gradient(264.13deg, ${theme.primary[400]} 16.15%, ${theme.primary[200]} 85.21%)`,
  fontSize: '24px',
  fontWeight: 'bold',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}));

const Flex = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '16px',
}));

export const Header = () => {
  return (
    <Wrapper>
      <Logo>Nosense</Logo>
      <Flex>
        <PlayButton />
        <SharePopover />
      </Flex>
    </Wrapper>
  );
};
