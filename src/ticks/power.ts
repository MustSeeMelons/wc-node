import { Gpio } from "onoff";
import { ITick } from "./tick";

const PIN = 20;

let currState = 0;

export const setupPowerButton = (toggleAudio: () => void): ITick => {
  const button = new Gpio(PIN, "in", "both", { debounceTimeout: 400 });

  // TODO we should really check if we arent shutting down
  button.watch((_err, level) => {
    if (currState !== level) {
      console.log(`Audio toggle - ${level}`);
      toggleAudio();
      currState = level;
    }
  });

  return {
    tick: () => {},
  };
};
