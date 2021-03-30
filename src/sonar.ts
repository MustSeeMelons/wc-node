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

    const tooooLong = (date: Date) => {
      const diff = new Date().getMilliseconds() - date.getMilliseconds();
      console.log("time diff: " + diff);
      return diff > 30
    }

    return {
      getDistance: async () => {
        await gpio.write(PIN_TRIG, false);
        console.log("low");
        sleep.usleep(2);
        await gpio.write(PIN_TRIG, true);
        console.log("high");
        sleep.usleep(10);
        await gpio.write(PIN_TRIG, false);
        console.log("low");

        let start: Date = new Date();
        while ((await gpio.read(PIN_ECHO)) === false) {
          start = new Date();
          if(tooooLong(start)) {
            console.log("never low");
            break;
          }
        }

        let end: Date = new Date();
        while ((await gpio.read(PIN_ECHO)) === true) {
          end = new Date();
          if(tooooLong(end)) {
            console.log("never high");
            break;
          }
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
