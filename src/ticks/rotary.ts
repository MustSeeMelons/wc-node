import { Gpio } from "onoff";
import { ITick } from "./tick";

const PIN_A = 22;
const PIN_B = 27;

const DEBOUNCE = 10;

let lastA = -1;
let lastB = -1;

let val = 0;
const changeRange = 5;

export const setupRotary = (changeVolume: (up: boolean) => void): ITick => {
  let upResetHandle;
  let downResetHandle;

  const resetCounter = () => {
    return setTimeout(() => (val = 0), 2000);
  };

  const clockwise = () => {
    val++;

    upResetHandle && clearTimeout(upResetHandle);

    if (val % changeRange === 0) {
      console.log("volume up!");
      changeVolume(true);
    }

    upResetHandle = resetCounter();
  };

  const counterClockwise = () => {
    val--;

    downResetHandle && clearTimeout(downResetHandle);

    if (val % changeRange === 0) {
      console.log("volume down!");
      changeVolume(false);
    }

    downResetHandle = resetCounter();
  };

  const aLead = new Gpio(PIN_A, "in", "both", { debounceTimeout: DEBOUNCE });

  const bLead = new Gpio(PIN_B, "in", "both", { debounceTimeout: DEBOUNCE });

  const doEncoder = () => {
    const a = aLead.readSync();
    const b = bLead.readSync();

    // Do nothing if any channel is at its default value
    if (lastA == -1 || lastB == -1) {
      lastA = a;
      lastB = b;
      return;
    }

    // Don't care if values did not change
    if (a == lastA && b == lastB) {
      return;
    }

    if (a == 1 && lastB == 0) {
      clockwise();
    }

    if (a == 1 && lastB == 1) {
      counterClockwise();
    }

    if (a == 0 && lastB == 0) {
      counterClockwise();
    }

    if (a == 0 && lastB == 1) {
      clockwise();
    }

    if (b == 1 && lastA == 0) {
      counterClockwise();
    }

    if (b == 1 && lastA == 1) {
      clockwise();
    }

    if (b == 0 && lastA == 1) {
      counterClockwise();
    }

    if (b == 0 && lastA == 0) {
      clockwise();
    }

    lastA = a;
    lastB = b;
  };

  aLead.watch(() => doEncoder());
  bLead.watch(() => doEncoder());

  return {
    tick: () => {},
  };
};
