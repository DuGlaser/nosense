import { styled } from '@mui/material';
import { Pane, PaneProps, Resizer } from '@split-pane/components';
import { ComponentProps, useMemo } from 'react';

type Props = ComponentProps<'div'> & {
  children: JSX.Element[];
};

const Flex = styled('div')(() => ({
  display: 'flex',
  width: '100%',
  height: '100%',
  flexDirection: 'column',
}));

const getPaneRrops = (element: JSX.Element): PaneProps => {
  return element.props as PaneProps;
};

export const SplitPane: React.FC<Props> = ({ children, ...rest }) => {
  const panes = useMemo(() => {
    return children
      .map((child) => {
        if (child.type !== Pane) {
          console.log('SplitPane children are must be Pane: ', child);
        }

        return child;
      })
      .reduce((elements, cur) => {
        if (elements.length === 0) return [cur];

        const prevPaneId = getPaneRrops(elements[0]).id;
        const nextPaneId = getPaneRrops(cur).id;

        return [
          ...elements,
          <Resizer
            key={`${nextPaneId}-${prevPaneId}`}
            nextPaneId={nextPaneId}
            prevPaneId={prevPaneId}
          />,
          cur,
        ];
      }, [] as JSX.Element[]);
  }, [children]);

  return <Flex {...rest}>{panes}</Flex>;
};
