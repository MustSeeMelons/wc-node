import { Gpio } from "onoff";
import { ITick } from "./tick";

const PIN_A = 22;
const PIN_B = 27;

const DEBOUNCE = 10;

let lastA = -1;
let lastB = -1;

type ValidRead = [number, number];

const validReads: ValidRead[] = [
  [1, 1],
  [1, 0],
  [0, 0],
  [0, 1],
];

let readIndex = -1;

const values = [];
const valueCount = 9;

export const setupRotary = (changeVolume: (up: boolean) => void): ITick => {
  const doChange = () => {
    const upCount = values.reduce((acc, curr) => {
      if (curr === 1) {
        return acc + 1;
      }

      return acc;
    }, 0);

    if (upCount > valueCount / 2) {
      changeVolume(true);
      console.log("volume up");
    } else {
      changeVolume(false);
      console.log("volume down");
    }

    values.length = 0;
  };

  const clockwise = () => {
    if (values.length < valueCount) {
      values.push(1);
      console.log("1 push");
    } else {
      doChange();
    }
  };

  const counterClockwise = () => {
    if (values.length < valueCount) {
      values.push(-1);
      console.log("-1 push");
    } else {
      doChange();
    }
  };

  const aLead = new Gpio(PIN_A, "in", "both", { debounceTimeout: DEBOUNCE });

  const bLead = new Gpio(PIN_B, "in", "both", { debounceTimeout: DEBOUNCE });

  const doOldEncoder = () => {
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

  const doNewEncoder = () => {
    const a = aLead.readSync();
    const b = bLead.readSync();

    if (readIndex === -1) {
      readIndex = validReads.findIndex((v) => v[0] === a && v[1] === b);
      return;
    }

    const newIndex = validReads.findIndex((v) => v[0] === a && v[1] === b);

    console.log(`value: ${a}-${b}`);
    console.log(`readIndex: ${readIndex}`);
    console.log(`newIndex: ${newIndex}`);

    if (
      newIndex > readIndex ||
      (newIndex === 0 && readIndex === validReads.length - 1)
    ) {
      clockwise();
      readIndex = newIndex;
    } else if (
      newIndex < readIndex ||
      (newIndex === validReads.length - 1 && readIndex === 0)
    ) {
      counterClockwise();
      readIndex = newIndex;
    }
  };

  aLead.watch(() => doNewEncoder());
  bLead.watch(() => doNewEncoder());

  return {
    tick: () => {},
  };
};
