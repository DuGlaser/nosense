import {
  BooleanObject,
  Environment,
  NullObject,
  NumberObject,
  StringObject,
} from '@/object';

describe('Enviroment', () => {
  describe('toObject', () => {
    test('outerがないとき', () => {
      const objs = {
        x: new StringObject({ value: 'x' }),
        y: new NumberObject({ value: 10 }),
        z: new BooleanObject({ value: true }),
      };

      const env = new Environment();

      for (const key in objs) {
        env.set(key, objs[key]);
      }

      expect(env.toObject()).toStrictEqual({
        x: 'x',
        y: 10,
        z: true,
      });
    });

    test('NULLが含まれているとき', () => {
      const objs = {
        x: new NullObject(),
        y: new NumberObject({ value: 10 }),
        z: new BooleanObject({ value: true }),
      };

      const env = new Environment();

      for (const key in objs) {
        env.set(key, objs[key]);
      }

      expect(env.toObject()).toStrictEqual({
        y: 10,
        z: true,
      });
    });

    test('outerある時', () => {
      const objs = {
        x: new StringObject({ value: 'x' }),
        y: new NumberObject({ value: 10 }),
        z: new BooleanObject({ value: true }),
      };

      const env = new Environment();
      for (const key in objs) {
        env.set(key, objs[key]);
      }

      const outerObjs = {
        xx: new StringObject({ value: 'xx' }),
        y: new NumberObject({ value: 20 }),
        z: new BooleanObject({ value: false }),
      };

      const innerEnv = env.extend();
      for (const key in outerObjs) {
        innerEnv.set(key, outerObjs[key]);
      }

      expect(innerEnv.toObject()).toStrictEqual({
        x: 'x',
        xx: 'xx',
        y: 20,
        z: false,
      });
    });
  });
});
