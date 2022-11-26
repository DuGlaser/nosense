import Obniz from 'obniz/dist/src/obniz';
import type LED from 'obniz/dist/src/parts/Light/LED/index.d';

import { BuiltinObject, NumberObject, Obj, StringObject } from '@/object';

import { ObnizModule } from './interface';

let obnizInstance: Obniz | undefined = undefined;

function getInstance() {
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
            return;
          }
          await this.init(code.value);
        },
      }),
      ['CLOSE']: new BuiltinObject({
        fn: async () => {
          await getInstance()?.closeWait();
        },
      }),
      ['LED']: new DamegaObnizLED(getInstance()),
    };
  }

  static isObnizCommand(fnName: string) {
    return fnName.match(/^Obniz\./);
  }

  async init(code: string) {
    const instance = new Obniz(code, { obnizid_dialog: false });
    setInstance(instance);
    await instance.connectWait({ timeout: 10000 });
  }
}

class DamegaObnizLED extends ObnizModule {
  constructor(instance: Obniz | undefined) {
    super(instance);
    this.commandList = {
      ...this.getCommandList(),
    };
  }

  public getCommandList() {
    return {
      ['ON']: new BuiltinObject({
        fn: (anode: Obj, cathode: Obj) => {
          if (
            anode instanceof NumberObject &&
            cathode instanceof NumberObject
          ) {
            this.getLED(anode.value, cathode.value)?.on();
          }
        },
      }),
      ['OFF']: new BuiltinObject({
        fn: (anode: Obj, cathode: Obj) => {
          if (
            anode instanceof NumberObject &&
            cathode instanceof NumberObject
          ) {
            this.getLED(anode.value, cathode.value)?.off();
          }
        },
      }),
      ['BLINK']: new BuiltinObject({
        fn: (anode: Obj, cathode: Obj) => {
          if (
            anode instanceof NumberObject &&
            cathode instanceof NumberObject
          ) {
            this.getLED(anode.value, cathode.value)?.blink();
          }
        },
      }),
      ['END_BLINK']: new BuiltinObject({
        fn: (anode: Obj, cathode: Obj) => {
          if (
            anode instanceof NumberObject &&
            cathode instanceof NumberObject
          ) {
            this.getLED(anode.value, cathode.value)?.endBlink();
          }
        },
      }),
    };
  }

  private getLED(anode: number, cathode: number): LED | undefined {
    return getInstance()?.wired('LED', { anode, cathode });
  }
}
