import { Gpio } from "pigpio";

const PIN = 22;

const button = new Gpio(PIN, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_DOWN,
  edge: Gpio.EITHER_EDGE,
});

// XXX pass in audio toggle function
export const setupPowerButton = () => {
  button.on("interrupt", (level) => {
    console.log("btn!");
  });
};
