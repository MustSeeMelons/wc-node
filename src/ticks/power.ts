import { Gpio } from "onoff";
import { ITick } from "./tick";

const PIN = 4;

const button = new Gpio(PIN, "in", "both");

let currState = 0;

export const setupPowerButton = (toggleAudio: () => void): ITick => {
  button.watch((err, level) => {
    console.log(`pwr level: ${level}`);
    if (currState !== level) {
      toggleAudio();
      currState = level;
    }
  });

  return {
    tick: () => {},
  };
};
