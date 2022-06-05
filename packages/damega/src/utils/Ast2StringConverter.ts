type Indent =
  | {
      type: 'TAB';
    }
  | {
      type: 'SPACE';
      count: number;
    };

type Ast2StringConverterContext = {
  indent: Indent;
  currentLevel: number;
};

export class Ast2StringConverter {
  private output: (string | Ast2StringConverter)[] = [];
  private currentText = '';
  private context: Ast2StringConverterContext;

  constructor(indent: Indent, currentLevel = 0) {
    this.context = {
      indent,
      currentLevel,
    };
  }

  public write(
    text: string,
    { left = '', right = '' }: { left?: string; right?: string } = {}
  ) {
    this.currentText += left + text + right;
  }

  public space() {
    this.currentText += ' ';
  }

  public return() {
    this.output.push(this.currentText + '\n');
    this.currentText = '';
  }

  public nest(cb: (nested: Ast2StringConverter) => void) {
    const nested = new Ast2StringConverter(
      this.context.indent,
      this.context.currentLevel + 1
    );

    this.output.push(nested);
    cb(nested);
  }

  public getNestedInstance(): Ast2StringConverter {
    const nested = new Ast2StringConverter(
      this.context.indent,
      this.context.currentLevel + 1
    );

    this.output.push(nested);

    return nested;
  }

  public clear() {
    this.currentText = '';
    this.output = [];
  }

  public toString() {
    if (this.currentText !== '') {
      this.output.push(this.currentText);
      this.currentText = '';
    }

    const indent = this.getIndent();

    return this.output
      .map((item) => {
        if (item instanceof Ast2StringConverter) {
          return item.toString();
        }

        return indent + item;
      })
      .join('');
  }

  private getIndent() {
    const outs: string[] = [];
    if (this.context.indent.type === 'TAB') {
      for (let i = 0; i < this.context.currentLevel; i++) {
        outs.push('\t');
      }
    } else {
      for (
        let i = 0;
        i < this.context.currentLevel * this.context.indent.count;
        i++
      ) {
        outs.push(' ');
      }
    }

    return outs.join('');
  }
}
