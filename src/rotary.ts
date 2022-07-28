import { Gpio } from "pigpio";

const PIN_A = 25;
const PIN_B = 24;

let lastA = -1;
let lastB = -1;

let val = 0;

const clockwise = () => {
  val++;
  console.log(val);
};

const counterClockwise = () => {
  val--;
  console.log(val);
};

const aLead = new Gpio(PIN_A, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_DOWN,
  edge: Gpio.EITHER_EDGE,
});

const bLead = new Gpio(PIN_B, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_DOWN,
  edge: Gpio.EITHER_EDGE,
});

const doEncoder = () => {
  const a = aLead.digitalRead();
  const b = bLead.digitalRead();

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

// XXX pass in audio change funciton
export const setupRotary = () => {
  console.log("setting up rotary");
  aLead.addListener("interrupt", () => {
    doEncoder();
  });

  bLead.addListener("interrupt", () => {
    doEncoder();
  });
};
