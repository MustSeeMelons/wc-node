import { Gpio } from "pigpio";

const PIN_TRIG = 4;
const PIN_ECHO = 24;
const MICROSECDONDS_PER_CM = 1e6 / 34321;

export interface ISonar {
  getDistance: () => Promise<number>;
}

export const sonarFactory = async (): Promise<ISonar | undefined> => {
  const trigger = new Gpio(PIN_TRIG, { mode: Gpio.OUTPUT });
  const echo = new Gpio(PIN_ECHO, { mode: Gpio.INPUT, alert: true });

  let value: number | undefined;
  let startTick = 0;

  echo.on("alert", (level, tick) => {
    if (level === 1) {
      startTick = tick;
    } else {
      const endTick = tick;
      const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
      value = diff / 2 / MICROSECDONDS_PER_CM;
    }
  });

  return {
    getDistance: async (): Promise<number> => {
      return new Promise((resolve, reject) => {
        value = undefined;
        trigger.trigger(10, 1);

        const handle = setInterval(() => {
          if (value) {
            clearInterval(handle);
            resolve(value);
          }
        }, 10);
      });
    },
  };
};
