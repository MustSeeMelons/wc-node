import { Gpio } from "onoff";
import { ITick } from "./tick";
const { spawn } = require("child_process");

const PIN = 4;

let triggered = false;

export const setupShutdownButton = (): ITick => {
  const button = new Gpio(PIN, "in", "rising", { debounceTimeout: 400 });

  button.watch((_err, level) => {
    // Allow but a single press
    if (triggered) {
      return;
    }

    if (level === 1) {
      triggered = true;
    }

    console.log(`Shutting down`);

    spawn("shutdown", ["-h", "now"]);
  });

  return {
    tick: () => {},
  };
};
