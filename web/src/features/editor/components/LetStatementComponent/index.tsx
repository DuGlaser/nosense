import {
  EditableNodeComponent,
  StatementWrapper,
  ValidateFn,
} from '@editor/components';
import { CompleteOption } from '@editor/hooks';
import { useInsertNode, useInsertStatement, useStatement } from '@editor/store';
import { StatementComponentProps } from '@editor/type';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button, Stack, styled } from '@mui/material';
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { createNewStatement, LetStatement } from '@/lib/models/editorObject';
import { hexToRgba } from '@/styles/utils';

const typeIdentOption: CompleteOption[] = [
  { displayName: '数値型', keyword: ['number', 'すうちがた', '数値型'] },
  { displayName: '文字列型', keyword: ['string', 'もじれつがた', '文字列型'] },
  { displayName: '論理型', keyword: ['bool', 'ろんりがた', '論理型'] },
];

const AddVarButton = styled(Button)(({ theme }) => ({
  border: 'none',
  outline: 'none',
  background: 'transparent',
  color: hexToRgba(theme.background[100], 0.6),
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  gap: '0.25em',
  cursor: 'pointer',
  padding: '6px',
  borderRadius: '3px',
  '&:hover': {
    background: hexToRgba(theme.background[100], 0.1),
  },
}));

export const LetStatementComponent: React.FC<StatementComponentProps> = ({
  id,
  active,
}) => {
  const statement = useStatement<LetStatement>(id);
  const insertNode = useInsertNode(id);

  const insertStmt = useInsertStatement();

  const typeIdetValidator: ValidateFn = useCallback((value) => {
    const isMatch = typeIdentOption.find(
      (option) => option.displayName === value
    );

    if (isMatch) {
      return undefined;
    }

    return {
      message:
        '変数のデータ型は数値型、文字列型、論理型のいずれかでなければなりません。',
    };
  }, []);

  const addNewVariable = () => {
    insertNode(statement.nodes.at(-1), {
      _type: 'EditableNode',
      id: uuidv4(),
      parentId: statement.id,
      content: '',
      editable: true,
      deletable: true,
    });
  };

  return (
    <StatementWrapper indent={statement.indent} active={active}>
      <EditableNodeComponent
        completeOptions={typeIdentOption}
        validate={typeIdetValidator}
        id={statement.nodes[0]}
      />
      :
      <Stack direction="row" divider={<span>,</span>}>
        {statement.nodes.slice(1).map((varName) => (
          <EditableNodeComponent
            key={varName}
            id={varName}
            inputEvent={[
              {
                key: 'Enter',
                callback: () => {
                  insertStmt(statement.id, [
                    createNewStatement({ indent: statement.indent }),
                  ]);
                },
              },
            ]}
          />
        ))}
      </Stack>
      <AddVarButton onClick={addNewVariable}>
        <AddCircleOutlineIcon
          sx={{
            fontSize: '1.5em',
          }}
        />
        <span>変数を追加する</span>
      </AddVarButton>
    </StatementWrapper>
  );
};
