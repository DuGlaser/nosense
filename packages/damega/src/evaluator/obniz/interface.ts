import { type Obniz } from 'obniz/dist/src/obniz/Obniz.d';

import { BuiltinObject } from '@/object';

export abstract class ObnizModule {
  protected instance: Obniz | undefined;

  constructor(instance: Obniz | undefined) {
    this.instance = instance;
  }

  protected commandList: Record<string, BuiltinObject<any> | ObnizModule> = {};
  abstract getCommandList(): Record<string, BuiltinObject<any> | ObnizModule>;
  public getCommand(
    commandName: string[]
  ): BuiltinObject<any> | ObnizModule | undefined {
    if (commandName.length === 0) {
      return undefined;
    }

    const command = this.commandList[commandName[0]];
    if (!command) {
      return undefined;
    }

    if (command instanceof ObnizModule) {
      commandName.shift();
      return command.getCommand(commandName);
    }

    return command;
  }
}
