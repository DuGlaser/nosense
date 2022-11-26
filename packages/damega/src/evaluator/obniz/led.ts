import Obniz from 'obniz/dist/src/obniz';
import type LED from 'obniz/dist/src/parts/Light/LED/index.d';

import { BuiltinObject, NumberObject, Obj } from '@/object';

import { getInstance } from '.';
import { ObnizModule } from './interface';

export class DamegaObnizLED extends ObnizModule {
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
