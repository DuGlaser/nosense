import { Ast2StringConverter } from './Ast2StringConverter';

describe('Ast2StringConverter', () => {
  test('nestしない', () => {
    const expected = `
let x: number = 0;
let y: number = 1;
let z: number = 2;
`;

    const converter = new Ast2StringConverter({ type: 'SPACE', count: 2 });
    converter.write('let', { right: ' ' });
    converter.write('x:', { right: ' ' });
    converter.write('number', { right: ' ' });
    converter.write('=', { right: ' ' });
    converter.write('0;');
    converter.return();

    converter.write('let', { right: ' ' });
    converter.write('y:', { right: ' ' });
    converter.write('number', { right: ' ' });
    converter.write('=', { right: ' ' });
    converter.write('1;');
    converter.return();

    converter.write('let', { right: ' ' });
    converter.write('z:', { right: ' ' });
    converter.write('number', { right: ' ' });
    converter.write('=', { right: ' ' });
    converter.write('2;');

    expect(expected.trim()).toBe(converter.toString());
  });

  test('nestする', () => {
    const expected = `
while (true) {
  while (true) {
    while (true) {
    }
  }
}
`;

    const converter = new Ast2StringConverter({ type: 'SPACE', count: 2 });
    converter.write('while', { right: ' ' });
    converter.write('(true)', { right: ' ' });
    converter.write('{');
    converter.return();
    converter.nest((_) => {
      _.write('while', { right: ' ' });
      _.write('(true)', { right: ' ' });
      _.write('{');
      _.return();

      _.nest((_) => {
        _.write('while', { right: ' ' });
        _.write('(true)', { right: ' ' });
        _.write('{');
        _.return();
        _.write('}');
        _.return();
      });

      _.write('}');
      _.return();
    });
    converter.write('}');

    expect(expected.trim()).toBe(converter.toString());
  });

  test('tabを使う', () => {
    const expected = `
while (true) {
\twhile (true) {
\t\twhile (true) {
\t\t}
\t}
}
`;

    const converter = new Ast2StringConverter({ type: 'TAB' });
    converter.write('while', { right: ' ' });
    converter.write('(true)', { right: ' ' });
    converter.write('{');
    converter.return();
    converter.nest((_) => {
      _.write('while', { right: ' ' });
      _.write('(true)', { right: ' ' });
      _.write('{');
      _.return();

      _.nest((_) => {
        _.write('while', { right: ' ' });
        _.write('(true)', { right: ' ' });
        _.write('{');
        _.return();
        _.write('}');
        _.return();
      });

      _.write('}');
      _.return();
    });
    converter.write('}');

    expect(expected.trim()).toBe(converter.toString());
  });
});
