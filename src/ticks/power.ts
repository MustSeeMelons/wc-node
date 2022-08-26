import { Gpio } from "pigpio";
import { ITick } from "./tick";

const PIN = 4;

const button = new Gpio(PIN, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_DOWN,
  edge: Gpio.EITHER_EDGE,
  alert: true,
});

let currState = 0;

export const setupPowerButton = (toggleAudio: () => void): ITick => {
  button.on("alert", (level) => {
    if (currState !== level) {
      toggleAudio();
      currState = level;
    }
  });

  return {
    tick: () => {},
  };
};
