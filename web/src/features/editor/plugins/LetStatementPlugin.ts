import { LetStatementElement } from '@editor/elements';
import { BlockToolConstructorOptions } from '@editorjs/editorjs';

import { LetStatementObject } from '@/lib/models/astObjects';
import { TYPE_IDENTIFIER } from '@/lib/models/astObjects/typeIdentifier';

import { AstObjectTool } from './base';

const initialLetStatement: LetStatementObject = {
  _type: 'LetStatement',
  typeIdentifier: TYPE_IDENTIFIER.NUMBER,
  name: 'x',
  expression: '10',
};

export class LetStatementPlugin implements AstObjectTool<LetStatementObject> {
  private _element: LetStatementElement;

  constructor({ readOnly }: BlockToolConstructorOptions) {
    this._element = new LetStatementElement(initialLetStatement, readOnly);
  }

  static get toolbox() {
    return {
      // TODO: 真面目にやる
      title: '変数宣言',
      icon: 'var',
    };
  }

  public render(): HTMLElement {
    return this._element.toDOM();
  }

  public save() {
    return this._element.toObject();
  }
}
