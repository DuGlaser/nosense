import { EditableNodeComponent, EditableNodeProps } from '@editor/components';
import { styled } from '@mui/material';

const Wrapper = styled('div')({
  maxWidth: '0.5em',
  minWidth: '0.5em',
  width: '0.5em',
  textAlign: 'center',
});

export const CursorNodeComponent: React.FC<EditableNodeProps> = (props) => {
  return (
    <Wrapper>
      <EditableNodeComponent
        data-node-label="cursor"
        {...props}
        onKeyDown={(e) => {
          e.preventDefault();
        }}
        onInput={(e) => {
          e.preventDefault();
        }}
      />
    </Wrapper>
  );
};
