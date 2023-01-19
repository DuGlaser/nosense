import { v4 as uuidv4 } from 'uuid';

import { BaseNode, PickNodeType } from '.';

export type EditableNode = BaseNode<PickNodeType<'EditableNode'>> & {
  placeholder?: string;
};

export const createEditableNode = ({
  content,
  parentId,
  placeholder,
}: Pick<
  EditableNode,
  'content' | 'parentId' | 'placeholder'
>): EditableNode => {
  return {
    _type: 'EditableNode',
    id: uuidv4(),
    parentId,
    content,
    placeholder,
    editable: true,
    deletable: true,
  };
};
