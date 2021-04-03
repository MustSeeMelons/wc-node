import { sonarFactory } from "./sonar";
import { audioPlayManagerFactory } from "./audio-manager";
import { Gpio } from "pigpio";
const { exec } = require("child_process");

const PIN_LED = 23;
const TRIGGER_DIST = 50;
const TRIGGER_END_DIST = TRIGGER_DIST * 2;
const SAMPLE_COUNT = 4;

const MIN_VOLUME = 30;
const MAX_VOLUME = 85;
const VOL_WAIT = 150;

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

const wait = async () => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, VOL_WAIT);
  });
}

const fadeIn = async () => {
  for(let i = MIN_VOLUME; i <= MAX_VOLUME; i += 2) {
    await new Promise<void>((resolve) => {
      exec(`amixer set PCM ${i}%`, () => {
        resolve();
      });
    });
    await wait();
  }
}

const fadeOut = async () => {
  for(let i = MAX_VOLUME; i >= MIN_VOLUME; i -= 1) {
    await new Promise((resolve) => {
      exec(`amixer set PCM ${i}%`, () => {
        resolve();
      });
    });
    await wait();
  }
}

export const sonarStateFactory = async (): Promise<ISonarState | undefined> => {
  try {
    const sonar = await sonarFactory();
    const audio = await audioPlayManagerFactory();
    exec(`amixer set PCM ${MIN_VOLUME}%`);
    const led = new Gpio(PIN_LED, { mode: Gpio.OUTPUT });

    let isLedOn = false;
    led.digitalWrite(0);
    let sonarState = SonarState.OnTrigger;

    const toggleLed = () => {
      led.digitalWrite(isLedOn ? 0 : 1);
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

      switch (sonarState) {
        case SonarState.OnTrigger:
          if (dist < TRIGGER_DIST) {
            sonarState = SonarState.OnTriggerEnd;
            toggleLed();
            audio.welcome();
            await fadeIn();
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
           
            await fadeOut();
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
