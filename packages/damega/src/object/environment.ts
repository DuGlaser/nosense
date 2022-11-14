import { NULL } from '@/evaluator';

import { ErrorObject, Obj } from './object';

export class Environment {
  public outer: Environment | undefined;
  private store: Record<string, Obj>;

  constructor(env: Environment | undefined = undefined) {
    this.outer = env;
    this.store = {};
  }

  public update(key: string, newValue: Obj): Obj | undefined {
    const value = this.store[key];

    if (!value && this.outer) {
      this.outer.update(key, newValue);
      return;
    }

    if (!value && !this.outer) {
      return new ErrorObject({ message: `${key} is not found.` });
    }

    if (value !== NULL && newValue.type() !== value.type()) {
      return new ErrorObject({
        message: `type mismatch: got=${newValue.type()}, expected=${value.type()}`,
      });
    }

    this.store[key] = newValue;

    return undefined;
  }

  public set(key: string, value: Obj) {
    this.store[key] = value;
  }

  public get(key: string): Obj | undefined {
    const value = this.store[key];

    if (value === undefined && this.outer) {
      return this.outer.get(key);
    }

    return value;
  }

  public extend() {
    return new Environment(this);
  }
}
