import CodeIcon from '@mui/icons-material/Code';
import { Button, styled } from '@mui/material';
import { NextPage } from 'next';

import { hexToRgba } from '@/styles/utils';

const Wrapper = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: `linear-gradient(264.13deg, ${theme.background[900]} 16.15%, ${theme.background[800]} 85.21%)`,
}));

const HeroWrapper = styled('div')(() => ({
  width: '100%',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '1rem',
}));

const Logo = styled('h1')(({ theme }) => ({
  background: `linear-gradient(264.13deg, ${theme.primary[400]} 16.15%, ${theme.primary[200]} 85.21%)`,
  fontSize: '5rem',
  fontWeight: 'bold',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '1.25rem',
  padding: '8px 32px',
  color: theme.primary.contrast[600],
  '&.MuiButton-outlined': {
    borderColor: theme.primary[600],
  },
  '&.MuiButton-contained': {
    background: theme.primary[600],
  },
}));

const ButtonGroup = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'celter',
  alignItems: 'center',
  gap: '2rem',
}));

const SampleWrapper = styled('div')(() => ({
  display: 'inline-block',
  width: '100%',
  padding: '15vh 20vw',
}));

const Title = styled('h2')(({ theme }) => ({
  color: theme.background.contrast[900],
  fontSize: '2rem',
}));

const Examples = styled('div')(() => ({
  marginTop: '2rem',
  display: 'grid',
  gap: '2em 2em',
  gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
}));

const ExampleItem = styled('a')(({ theme }) => ({
  textDecoration: 'none',
  color: theme.background.contrast[900],
  width: '100%',
  padding: '24px 40px',
  border: `2px solid ${hexToRgba(theme.background.contrast['800'], 0.1)}`,
  borderRadius: '4px',
  fontSize: '1.25rem',
  display: 'flex',
  gap: '2rem',
  alignItems: 'center',
}));

const examples = [
  {
    name: 'Hello, World!',
    href: '/edit?code=TY8xCsIwGIWvIm%252FOoC5CT%252BBUnHTQIqGNWkjTkqaClA4tQkV3Owh6Aj2A1wnxHMYq0u3n%252Fe97j5djAGeeY6l2CYMzIkiopFEKJ8dXwutcm3tjDo25nkCwpdKlEbOOOVJ4RUH%252B9KBLC2uydNoiPPvcC4wZ5zHpzWLJgwXsKxQBEwpOv5sz7Ob8HQSrTPgqjIX7jZ7IUCgubAqV67SdEbAVzbia%252Fgo%252F5QmnPtvEPGDSKqZ%252BmuNFl40ub7rc66rS5QOFneEVbw%253D%253D',
  },
  {
    name: 'ユーザーの入力を受け付ける',
    href: '/edit?code=q1YyVLKKrlaKL6ksSFWyMtdRKkgsSswtVrKqVoIIKT2b1v507fSnHdOfzutW0lEqSyzyS8xNBaqIVipWiq2t1YHrNkTWnQdUBNRdDNaSUwpie%252BYVlJZoaAJFMvNSUvNKlKwMkLUbIWuHq9BRSivNSy7JzM%252Fzg5gYUJSZV5KTBzQlsSi9GOz6lNS0xNKckjCoPSA7C3ISk1Mz8nNSUouAIk%252Fbdz3tmv24cfrjxvmPG1seNzU9blynVAt0fWwtAA%253D%253D',
  },
  {
    name: 'If文で条件分岐する',
    href: '/edit?code=q1YyVLKKrlaKL6ksSFWyMtdRKkgsSswtVrKqVoIIKT2buuFpw5Kn87qVdJTKEov8EnNTgdLRSnlKsbW1OnCthsha84CKgFrzwFpySkFsz7yC0hINTaBIZl5Kal6JkpUBsnYzZO3J%252BXkpmSWZ%252BXkgMxTsFAwNcGkzQtYGUwF0SlppXjLIAD%252BIQwKKMvNKckDOSSxKLwb7OCU1LbE0pyQM6rwYpbzHjT2GBo%252BbOh43dT1dsvxxY%252B%252FjxpbHjUDGzMcNTTFKQM0FOYnJqRn5OSmpRUAtT9t3Pe2a%252Fbhx%252BuPG%252BSClTU2PG9cp1aKEiik29xHrcZsB8PiG%252FseNUwfa47a2dPP5eqDPaeTV2FoA',
  },
  {
    name: 'While文で繰り返し処理する',
    href: '/edit?code=q1YyVLKKrlaKL6ksSFWyMtdRKkgsSswtVrKqVoIIKT2buuFpw5Kn87qVdJTKEov8EnNTgdLRSnlKsbW1OnCthsha84CKgFrzwFpySkFsAyA7My8lNa9EycoAWaMRska4Ch2ltNK85JLM%252FDw%252FiFkBRZl5JTkgExOL0ovBjk5JTUsszSkJg9oQo%252FR%252Bz6THjeueNvQC3fy4adLT9l1Pu2Y%252Fbpz%252BuHHf48aZMUpAzQU5icmpGfk5KalFQC1IKuY%252Fbmx53NQE1K9Ui%252BoxAxwOTM7PS8kEuRDkUwUbBWMDJYL%252BMiTDX3nkOZtAfOQpaCsYIcWJIbJmS6xergXaAAA%253D',
  },
  {
    name: 'LEDを点滅させる',
    href: '/edit?code=1ZTPS%252BNAFMf%252FlfJOClUSL4s97EUrFKRdULyoyJiMNpBOQkwW1lLYSXepqCAotaigHvwBBbt7E5f9b4Zp8b9wptm4ia1ZkbrUU8Jk3jfvfd77vjKokFksw4r7xcaQ%252BZAGGzmotAGZMgRH0D6s8ZsG32rw0x1Iw2fk5FEJixuLYK0SY3PF0GG5Ukkni9R%252F8q8XvQqa5RFXnCFi6Vg8NeQW5VtMcCIqaBAdi5CMkoY1j2iuYRGpJv7xyTGIaxKp5qxvdMvS8RryTHcBmZ68sQQFmXFumvn7%252FPsl3z5htMHoFaN7jJ4zWmf02xIIAdtEGi5apo4dEcZrv8KrZ%252BIG831GWyATfKLf%252FyxWixqthQSJP2KUbIKoHLE9d2RUnDzW%252B0ZEuuQFj%252FZujbeOh4JHOAz%252FH8af8RsuHKEnBg2k64XxqUI%252Bn52aT8ASGc944VZgpleWOsC2zWalozv%252BXYf%252BYPSI%252BTv85FSsnOGyebjrXthFVXkGkGYR3ZCEQs3Ux5QC%252F0Sr9qCdMzG2E8CqitIDifl3rNpk1d%252Bs2ghQt4%252F8%252B8ODEVY9Ex861%252Fujg5yH3qSDqRUdHy%252FkE3IPd0g8%252B2DZ0Van3uR7t%252F2S%252Bmu2eGS4GZJiB1fke%252B%252FMzMz7a81LLBvYbSylRkyrRkUm%252B3r29ct5tjCXTUDZLWG58gA%253D',
  },
];

const IndexPage: NextPage = () => {
  return (
    <Wrapper>
      <HeroWrapper>
        <Logo>Nosense</Logo>
        <ButtonGroup>
          <StyledButton variant="contained" href={'/edit'}>
            新規作成
          </StyledButton>
          <StyledButton variant="outlined" href={'#examples'}>
            サンプル
          </StyledButton>
        </ButtonGroup>
      </HeroWrapper>
      <SampleWrapper>
        <Title id={'examples'}>サンプル</Title>
        <Examples>
          {examples.map((example, i) => (
            <ExampleItem key={i} href={example.href}>
              <CodeIcon />
              {example.name}
            </ExampleItem>
          ))}
        </Examples>
      </SampleWrapper>
    </Wrapper>
  );
};

export default IndexPage;
