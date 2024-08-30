import { Gpio } from "pigpio";
import { configManager } from "./config-manager";

const PIN_LED = 23;

const led = new Gpio(PIN_LED, { mode: Gpio.OUTPUT });
let isLedOn = false;

// Write low just in case
if (!configManager.getLedIgnore()) {
  led.pwmWrite(0);
}

export const setLedState = (value: boolean) => {
  if (configManager.getLedIgnore()) {
    return;
  }

  if (value) {
    led.pwmWrite(configManager.getLedBrightness());
  } else {
    led.pwmWrite(0);
  }

  isLedOn = value;
};

export const setLedBrightness = (value: number) => {
  led.pwmWrite(value);
};

export const getLedState = () => {
  return isLedOn;
};
