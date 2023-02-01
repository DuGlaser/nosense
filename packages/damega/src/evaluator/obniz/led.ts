import Obniz from 'obniz/dist/src/obniz';
import type LED from 'obniz/dist/src/parts/Light/LED/index.d';

import { BuiltinObject, NumberObject, Obj } from '@/object';

import { NULL } from '..';
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

          return NULL;
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

          return NULL;
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

          return NULL;
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

          return NULL;
        },
      }),
    };
  }

  private getLED(anode: number, cathode: number): LED | undefined {
    return getInstance()?.wired('LED', { anode, cathode });
  }
}
