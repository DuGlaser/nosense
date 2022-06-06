import { Token } from '@/token';

export class TypeIdentifier {
  private _token: Token;

  constructor({ token }: { token: Token }) {
    this._token = token;
  }

  public string(): string {
    return this._token.ch;
  }

  public inspect(): string {
    return this.string();
  }

  public tokenLiteral(): string {
    return this._token.ch;
  }

  get token() {
    return this._token;
  }
}
