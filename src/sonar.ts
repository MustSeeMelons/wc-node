import { promise as gpio } from "rpi-gpio";
const sleep = require("sleep");

const PIN_TRIG = 7;
const PIN_ECHO = 18;
const SONIC_SPEED = 0.034; // cm/micro second

export interface ISonar {
  getDistance: () => Promise<number>;
}

export const sonarFactory = async (): Promise<ISonar | undefined> => {
  try {
    await gpio.setup(PIN_TRIG, gpio.DIR_OUT);
    await gpio.setup(PIN_ECHO, gpio.DIR_IN);

    return {
      getDistance: async () => {
        await gpio.write(PIN_TRIG, false);
        sleep.usleep(2);
        await gpio.write(PIN_TRIG, true);
        sleep.usleep(10);
        await gpio.write(PIN_TRIG, false);

        let start: Date;
        while ((await gpio.read(PIN_ECHO)) === false) {
          start = new Date();
        }

        let end: Date;
        while ((await gpio.read(PIN_ECHO)) === true) {
          end = new Date();
        }

        const duration = end.getMilliseconds() - start.getMilliseconds();

        return (SONIC_SPEED * duration * 1000) / 2;
      },
    };
  } catch (e) {
    console.error(e);
    return undefined;
  }
};
