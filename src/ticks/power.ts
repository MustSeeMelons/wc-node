import { Gpio } from "onoff";
import { ITick } from "./tick";

const PIN = 4;

let currState = 0;

export const setupPowerButton = (toggleAudio: () => void): ITick => {
  const button = new Gpio(PIN, "in", "both", { debounceTimeout: 400 });

  button.watch((_err, level) => {
    console.log(`power toggle - ${level}`);
    if (currState !== level) {
      toggleAudio();
      currState = level;
    }
  });

  return {
    tick: () => {},
  };
};
