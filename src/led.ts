import { configManager } from "./config-manager";
import { Gpio } from "onoff";

const PIN_LED = 23;

// Used to have pigpio with pwm, but it now interferes with audio playback, so onoff it is
const led = new Gpio(PIN_LED, "out");
let isLedOn = false;

// Write low just in case
if (!configManager.getLedIgnore()) {
  led.writeSync(0);
}

export const setLedState = (value: boolean) => {
  if (configManager.getLedIgnore()) {
    return;
  }

  if (value) {
    led.writeSync(1);
  } else {
    led.writeSync(0);
  }

  isLedOn = value;
};

export const getLedState = () => {
  return isLedOn;
};
