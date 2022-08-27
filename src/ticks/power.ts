import { Gpio } from "onoff";
import { ITick } from "./tick";

const PIN = 4;

let currState = 0;

export const setupPowerButton = (toggleAudio: () => void): ITick => {
  const button = new Gpio(PIN, "in", "both", { debounceTimeout: 500 });

  button.watch((_err, level) => {
    if (currState !== level) {
      toggleAudio();
      currState = level;
    }
  });

  return {
    tick: () => {},
  };
};
