import {
  EditableNodeComponent,
  StatementWrapper,
  ValidateFn,
} from '@editor/components';
import { CompleteOption, useDeleteStatementInputEvent } from '@editor/hooks';
import { useInsertNode, useInsertStatement, useStatement } from '@editor/store';
import { InputEvent, StatementComponentProps } from '@editor/type';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button, Stack, styled } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { createLetStatement, LetStatement } from '@/lib/models/editorObject';
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
  ...rest
}) => {
  const statement = useStatement<LetStatement>(id);
  const [typeNode, ...varNameNodes] = statement.nodes;
  const insertNode = useInsertNode(id);
  const { insertNextStatement, insertPrevStatement } = useInsertStatement();

  const deleteStatementInputEvent = useDeleteStatementInputEvent([id]);

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

  const createNextLetStatement = useCallback(() => {
    insertNextStatement(statement.id, [
      createLetStatement({ type: '', varNames: [''] }),
    ]);
  }, [insertNextStatement]);

  const createPrevLetStatement = useCallback(() => {
    insertPrevStatement(statement.id, [
      createLetStatement({ type: '', varNames: [''] }),
    ]);
  }, [insertPrevStatement]);

  const addLetStatementInputEvent = useMemo<InputEvent[]>(
    () => [
      {
        key: 'Enter',
        ctrlKey: true,
        callback: () => createNextLetStatement(),
      },
      {
        key: 'Enter',
        ctrlKey: true,
        shiftKey: true,
        callback: () => createPrevLetStatement(),
      },
    ],
    [insertNextStatement, insertPrevStatement]
  );

  const inputEvent = [
    ...addLetStatementInputEvent,
    ...deleteStatementInputEvent,
  ];

  return (
    <StatementWrapper
      statementId={id}
      indent={statement.indent}
      {...rest}
      onCreateNextNewStatemnt={createNextLetStatement}
      onCreatePrevNewStatemnt={createPrevLetStatement}
    >
      <EditableNodeComponent
        completeOptions={typeIdentOption}
        validate={typeIdetValidator}
        id={typeNode}
        inputEvent={inputEvent}
        placeholder={'変数型'}
      />
      :
      <Stack direction="row" divider={<span>,</span>}>
        {varNameNodes.map((varName) => (
          <EditableNodeComponent
            key={varName}
            id={varName}
            placeholder={'変数名'}
            inputEvent={inputEvent}
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
