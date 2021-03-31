import { promise as gpio } from "rpi-gpio";
const sleep = require("sleep");

const PIN_TRIG = 7;
const PIN_ECHO = 18;
const SONIC_SPEED = 0.034; // cm/micro second

export interface ISonar {
  getDistance: () => Promise<number>;
}

export const sonarFactory = async (): Promise<ISonar | undefined> => {
  await gpio.setup(PIN_TRIG, gpio.DIR_OUT);
  await gpio.setup(PIN_ECHO, gpio.DIR_IN);

  const tooooLong = (then: Date) => {
    const now = new Date();
    const diff = now.getTime() - then.getTime();
    return diff > 60
  }

  return {
    getDistance: async () => {
      await gpio.write(PIN_TRIG, false);
      sleep.usleep(2); // halts all JS!
      await gpio.write(PIN_TRIG, true);
      sleep.usleep(10);
      await gpio.write(PIN_TRIG, false);

      let start = process.hrtime();
      let init: Date = new Date();

      while ((await gpio.read(PIN_ECHO)) === false) {
        start = process.hrtime();
        if(tooooLong(init)) {
          console.log("always low");
          return -1;
        }
      }

      let duration = process.hrtime(start);
      let init: Date = new Date();
      while ((await gpio.read(PIN_ECHO)) === true) {
        duration = process.hrtime(start);
        if(tooooLong(init)) {
          console.log("always high");
          return -1;
        }
      }

      sleep.msleep(60);

      return (SONIC_SPEED * duration[1] / 1000) / 2;
    },
  };
};
