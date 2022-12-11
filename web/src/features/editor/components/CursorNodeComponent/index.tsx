import { EditableNodeComponent, EditableNodeProps } from '@editor/components';
import { styled } from '@mui/material';
import { forwardRef } from 'react';

const Wrapper = styled('div')({
  maxWidth: '0.5em',
  minWidth: '0.5em',
  width: '0.5em',
  textAlign: 'center',
});

export const CursorNodeComponent = forwardRef<
  HTMLDivElement,
  EditableNodeProps
>(function CursorNodeComponent(props, ref) {
  return (
    <Wrapper>
      <EditableNodeComponent
        data-node-label="cursor"
        {...props}
        ref={ref}
        onKeyDown={(e) => {
          e.preventDefault();
        }}
        onInput={(e) => {
          e.preventDefault();
        }}
      />
    </Wrapper>
  );
});
