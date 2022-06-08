import { Obj } from './object';

export class Environment {
  public outer: Environment | undefined;
  private store: Record<string, Obj>;

  constructor() {
    this.outer = undefined;
    this.store = {};
  }

  public set(key: string, value: Obj) {
    this.store[key] = value;
  }

  public get(key: string): Obj | undefined {
    return this.store[key];
  }
}
