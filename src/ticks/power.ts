import { Gpio } from "pigpio";
import { ITick } from "./tick";

const PIN = 22;

const button = new Gpio(PIN, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_DOWN,
  edge: Gpio.EITHER_EDGE,
});

let currState = 0;

export const setupPowerButton = (toggleAudio: () => void): ITick => {
  return {
    tick: () => {
      const val = button.digitalRead();

      if (currState !== val) {
        toggleAudio();
        currState = val;
      }
    },
  };
};
