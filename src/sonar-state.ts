import { sonarFactory } from "./sonar";
import { audioPlayManagerFactory, MIN_VOLUME } from "./audio-manager";
import { fadeInAudio, fadeOutAudio, setVolume } from "./audio-manager";
import { IAudioStream, streamFactory } from "./stream";
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
    await setVolume(MIN_VOLUME);
    const sonar = await sonarFactory();
    const audio = await audioPlayManagerFactory();
    let stream: IAudioStream;
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

    // TODO read from file or something
    const playAudio = async () => {
      toggleLed();
      if (true) {
        stream = streamFactory();
      } else {
        audio.welcome();
      }

      await fadeInAudio();
    };

    const stopAudio = async () => {
      await fadeOutAudio();
      if (true) {
        stream && stream.close();
      } else {
        audio.bye();
      }
      toggleLed();
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
            await playAudio();
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
            await stopAudio();
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
