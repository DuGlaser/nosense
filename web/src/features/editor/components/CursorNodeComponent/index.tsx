import { EditableNodeComponent, EditableNodeProps } from '@editor/components';

export const CursorNodeComponent: React.FC<EditableNodeProps> = (props) => {
  return (
    <EditableNodeComponent
      {...props}
      onKeyDown={(e) => {
        e.preventDefault();
      }}
      onInput={(e) => {
        e.preventDefault();
      }}
    />
  );
};
