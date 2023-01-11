import { match, P } from 'ts-pattern';

import {
  BooleanObject,
  ErrorObject,
  NumberObject,
  Obj,
  OBJECT,
  StringObject,
} from './object';

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

    if (value.type() !== OBJECT.NULL && newValue.type() !== value.type()) {
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

  public toObject(): Record<string, string | number | boolean> {
    const outer = this.outer?.toObject() ?? {};
    const current: Record<string, string | number | boolean> = Object.entries(
      this.store
    ).reduce((pre, [key, value]) => {
      return match(value)
        .with(
          P.instanceOf(NumberObject),
          P.instanceOf(StringObject),
          P.instanceOf(BooleanObject),
          (v) => {
            pre[key] = v.value;
            return pre;
          }
        )
        .otherwise(() => pre);
    }, {});

    return { ...outer, ...current };
  }
}
