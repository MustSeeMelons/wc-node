import { sonarFactory } from "./sonar";
import { audioManagerFactory } from "./audio-manager";
import { Gpio } from "pigpio";

const PIN_LED = 23;
const TRIGGER_DIST = 50;
const TRIGGER_END_DIST = TRIGGER_DIST * 2;
const SAMPLE_COUNT = 4;

export enum SonarState {
  OnTrigger = "OnTrigger",
  OnTriggerEnd = "OnTriggerEnd",
  OffTrigger = "OffTrigger",
  OffTriggerEnd = "OffTriggerEnd",
}

export interface ISonarState {
  stateTick: () => void;
  getSonarState: () => SonarState;
}

export const sonarStateFactory = async (): Promise<ISonarState | undefined> => {
  try {
    const sonar = await sonarFactory();
    const audio = await audioManagerFactory();
    const led = new Gpio(PIN_LED, { mode: Gpio.OUTPUT });

    let isLedOn = false;
    led.digitalWrite(0);
    let sonarState = SonarState.OnTrigger;

    const toggleLed = () => {
      led.digitalWrite(isLedOn ? 1 : 0);
      isLedOn = !isLedOn;
    };

    const median = (arr: number[]) => {
      if (arr.length % 2 === 0) {
        return arr[arr.length / 2];
      } else if (arr.length === 1) {
        return arr[0];
      } else {
        const lower = arr[Math.floor(arr.length / 2)];
        const upper = arr[Math.ceil(arr.length / 2)];

        return (lower + upper) / 2;
      }
    };

    const filter = (arr: number[]) => {
      arr.sort((a, b) => a - b);
      return median(arr);
    };

    const stateTick = async () => {
      const samples = [];
      for (let i = 0; i < SAMPLE_COUNT; i++) {
        const dist = await sonar.getDistance();
        if (dist > 0) {
          samples.push(dist);
        }
      }

      if (samples.length === 0) {
        return;
      }

      const dist = filter(samples);

      console.log(`dist: ${dist}`);

      switch (sonarState) {
        case SonarState.OnTrigger:
          if (dist < TRIGGER_DIST) {
            sonarState = SonarState.OnTriggerEnd;
            toggleLed();
            audio.welcome();
          }
          break;
        case SonarState.OnTriggerEnd:
          if (dist > TRIGGER_END_DIST) {
            sonarState = SonarState.OffTrigger;
          }
          break;
        case SonarState.OffTrigger:
          if (dist < TRIGGER_DIST) {
            sonarState = SonarState.OffTriggerEnd;
            toggleLed();
            audio.bye();
          }
          break;
        case SonarState.OffTriggerEnd:
          if (dist > TRIGGER_END_DIST) {
            sonarState = SonarState.OnTrigger;
          }
          break;
      }
    };

    return {
      stateTick,
      getSonarState: () => {
        return sonarState;
      },
    };
  } catch (e) {
    console.error(e);
    return undefined;
  }
};
