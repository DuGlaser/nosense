/* eslint-disable no-restricted-imports */
import readline from 'readline';

import { Environment, Evaluator, Lexer, Parser } from '../dist';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt('> ');
rl.prompt();

const env = new Environment();
const e = new Evaluator({
  inputEventCallback: async () => new Promise((resolve) => resolve('')),
  outputEventCallback: () => {},
});

rl.on('line', async (line) => {
  const l = new Lexer(line);
  const p = new Parser(l);

  const output = await e.Eval(p.parseToken(), env);
  console.log(JSON.stringify(output));
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});
