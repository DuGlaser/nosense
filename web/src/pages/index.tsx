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
    href: '/edit?code=zVTNSsNAGHyV8p0UqiRexB68%252BAOCtILiRUXWZNVA3ISYCFoKbqpUVCgotaigHvwBwepNFN9m2Rbfwt3GaGK1FtHiKWGz3%252BzM7EyyoEJqKguz7qqNIdWbBBs5aGkZUlkIlqB6UOA3Zb5V5ic7kIQV5KTREhY7psCaI8barKHDTC6XbA5SuuPr540ImuURV6whYulYPDXkLsq3GGBPFNAgOhYjKSUJ8x7RXMMiEk2cMeYYxDWJRHMWluuydDyPPNOdRKYnd0xDRjIeGWT%252BHt%252B84NvHjJYZvWS0yOgZoyVGN6ZBANgm0vCiZerYEWO88BhuPRU7mO8zWoFcjKMa5UgCQm%252F2SM0BgxFie25Hp1h50%252FFHSuuOCp3V3QKvHP2pzvDy2i%252FyNS7tkRlm87eF1jPZPZBJp4cGJprIjcQpLsgKQv1Bwi%252FaPDokG1PzH2r0ltFD5u%252Fw4xNR6fbUKPxHtOi6qnwhXLOIbkjlIWaiP6HAt5apDZaNmxjbTQxTFaVBPPMfWP6a5Z9YvhxYWD30nw%252F2O1j%252BVHyoXe11tnJ%252FjWSC9Igb6s6km3AKOxpnFfwkaKVWuubFe5Cnf5h7D318Mmze%252B%252BxPyP9XJ4eH%252F4%252BVrVQiiHNXQo2UQo2C9H3aiZw46QU%253D',
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
