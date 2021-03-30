import { promise as gpio } from "rpi-gpio";
const sleep = require('sleep');

const PIN_TRIG = 7;
const PIN_ECHO = 18;
const SONIC_SPEED = 0.034; // cm/micro second

export interface ISonar {
  getDistance: () => number;
}

export const sonarFactory = async (): Promise<ISonar | undefined> => {
  try {
    await gpio.setup(PIN_TRIG, gpio.DIR_OUT);
    await gpio.setup(PIN_ECHO, gpio.DIR_IN);
  
    return {
      getDistance: () => {

        // gpio.write(PIN_TRIG,)

        return 0;
      },
    };
  } catch(e) {
    console.error(e);
    return undefined;
  }
  
};
