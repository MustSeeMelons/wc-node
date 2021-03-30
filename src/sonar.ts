import { promise as gpio } from "rpi-gpio";

const GPIO_TRIG = 4;
const GPIO_ECHO = 24;
const SONIC_SPEED = 0.034; // cm/micro second

export interface ISonar {
  getDistance: () => number;
}

export const sonarFactory = async (): Promise<ISonar> => {
  await gpio.setup(GPIO_TRIG, gpio.DIR_OUT);
  await gpio.setup(GPIO_ECHO, gpio.DIR_IN);

  return {
    getDistance: () => {
      return 0;
    },
  };
};
