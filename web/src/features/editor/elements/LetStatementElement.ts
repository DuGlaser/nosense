import { match } from 'ts-pattern';

import { LetStatementObject, TYPE_IDENTIFIER } from '@/lib/models/astObjects';

export class LetStatementElement {
  private rootElement: HTMLElement;
  private nameElement: HTMLElement;
  private typeElement: HTMLElement;
  private readOnly: boolean;

  constructor(object: LetStatementObject, readOnly = false) {
    this.readOnly = readOnly;
    this.rootElement = document.createElement('div');
    this.rootElement.classList.add(LetStatementElement.rootElementClassName);

    this.typeElement = this.createTypeElement(object.typeIdentifier);
    this.nameElement = this.createNameElement(object.name);

    this.typeElement.addEventListener('input', (e) => {
      console.log(e);
    });

    const separatorEl = document.createElement('div');
    separatorEl.textContent = ':';

    this.rootElement.append(this.typeElement, separatorEl, this.nameElement);
  }

  static get rootElementClassName() {
    return 'let-statement';
  }

  static get typeElementClassName() {
    return 'let-statement-type-identifier';
  }

  private createTypeElement(
    typeIdentifier: LetStatementObject['typeIdentifier']
  ) {
    const typeEl = document.createElement('span');
    typeEl.classList.add(LetStatementElement.typeElementClassName);

    const typeLabel = match(typeIdentifier)
      .with(TYPE_IDENTIFIER.NUMBER, () => '数値型')
      .with(TYPE_IDENTIFIER.STRING, () => '文字列型')
      .with(TYPE_IDENTIFIER.BOOLEAN, () => '論理型')
      .exhaustive();

    typeEl.textContent = typeLabel;
    this.setContentEditable(typeEl);

    return typeEl;
  }

  static get nameElementClassName() {
    return 'let-statement-type-identifier';
  }

  private createNameElement(name: LetStatementObject['name']) {
    const nameEl = document.createElement('span');
    nameEl.classList.add(LetStatementElement.nameElementClassName);
    nameEl.textContent = name;
    this.setContentEditable(nameEl);

    return nameEl;
  }

  public toDOM(): HTMLElement {
    return this.rootElement;
  }

  public toObject(): LetStatementObject {
    // const type = this.typeElement.textContent ?? '';
    const name = this.nameElement.textContent ?? '';

    return {
      _type: 'LetStatement',
      typeIdentifier: TYPE_IDENTIFIER.NUMBER,
      name,
      expression: '',
    };
  }

  private setContentEditable(element: HTMLElement) {
    element.contentEditable = this.readOnly ? 'false' : 'true';
  }
}
