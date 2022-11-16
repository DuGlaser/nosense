import { EditableNodeComponent, EditableNodeProps } from '@editor/components';
import { styled } from '@mui/material';

const Wrapper = styled('div')({
  maxWidth: '5px',
});

export const CursorNodeComponent: React.FC<EditableNodeProps> = (props) => {
  return (
    <Wrapper>
      <EditableNodeComponent
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
