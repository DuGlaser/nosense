import ObnizApp from '@nosense/web-obniz';
import type { Obniz } from 'obniz/dist/src/obniz/Obniz';

import { BuiltinObject, Obj, StringObject } from '@/object';

import { NULL } from '..';
import { ObnizModule } from './interface';
import { DamegaObnizLED } from './led';

let obnizInstance: Obniz | undefined = undefined;

export function getInstance() {
  return obnizInstance;
}

function setInstance(obniz: Obniz) {
  obnizInstance = obniz;
}

export class DamegaObniz extends ObnizModule {
  constructor() {
    super(undefined);
    this.commandList = {
      ...this.getCommandList(),
    };
  }

  public getCommandList() {
    return {
      ['CONNECT']: new BuiltinObject({
        fn: async (code: Obj) => {
          if (!(code instanceof StringObject)) {
            return NULL;
          }
          await this.init(code.value);
          return NULL;
        },
      }),
      ['CLOSE']: new BuiltinObject({
        fn: async () => {
          await getInstance()?.closeWait();
          return NULL;
        },
      }),
      ['LED']: new DamegaObnizLED(getInstance()),
    };
  }

  static isObnizCommand(fnName: string) {
    return fnName.match(/^Obniz\./);
  }

  async init(code: string) {
    const instance = new ObnizApp(code, { obnizid_dialog: false });
    setInstance(instance);
    await instance.connectWait({ timeout: 10000 });
  }
}
