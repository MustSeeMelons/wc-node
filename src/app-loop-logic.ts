import { ISonar } from "./sonar";
import { IAudioManager } from "./audio-manager";
import { fadeInAudio, fadeOutAudio, setVolume } from "./audio-manager";
import { IAudioStream, streamFactory } from "./stream";
import { Gpio } from "pigpio";
import { configManager } from "./config-manager";
import { wait } from "./utils";

const PIN_LED = 23;
const TRIGGER_DIST = 50;
const TRIGGER_END_DIST = TRIGGER_DIST * 2;
const SAMPLE_COUNT = 1;

export enum SonarState {
  OnTrigger = "OnTrigger",
  OnTriggerEnd = "OnTriggerEnd",
  OffTrigger = "OffTrigger",
  OffTriggerEnd = "OffTriggerEnd",
}

export interface IAppLogic {
  stateTick: () => Promise<void>;
  getSonarState: () => SonarState;
  playAudio: () => Promise<void>;
  stopAudio: () => Promise<void>;
  setStreamDataCallback: (cb: (data: string) => void) => void;
}

let streamDataCallback: (data: string) => void;

export const appLogicFactory = async (
  sonar: ISonar,
  audio: IAudioManager
): Promise<IAppLogic | undefined> => {
  try {
    await setVolume(configManager.getMinVolume());
    let stream: IAudioStream | undefined;
    const led = new Gpio(PIN_LED, { mode: Gpio.OUTPUT });

    let isLedOn = false;
    led.digitalWrite(0);
    let sonarState = SonarState.OnTrigger;

    const setLedState = (value: boolean) => {
      led.digitalWrite(value);
      isLedOn = value;
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

    const playAudio = async () => {
      setLedState(true);
      if (stream) {
        stream.close();
      }

      stream = streamFactory(streamDataCallback);
      await fadeInAudio();
    };

    const stopAudio = async () => {
      await fadeOutAudio();
      stream && stream.close();
      setLedState(false);
    };

    const stateTick = async () => {
      const samples = [];
      for (let i = 0; i < SAMPLE_COUNT; i++) {
        const dist = await sonar.getDistance();
        if (dist > 0) {
          samples.push(dist);
        }
        // From the sonar spec, 60ms between reads
        await wait(50);
      }

      if (samples.length === 0) {
        return;
      }

      const dist = filter(samples);

      switch (sonarState) {
        case SonarState.OnTrigger:
          if (dist < TRIGGER_DIST) {
            sonarState = SonarState.OnTriggerEnd;
            configManager.setActive(true);
            await playAudio();
          }
          break;
        case SonarState.OnTriggerEnd:
          if (dist > TRIGGER_DIST) {
            sonarState = SonarState.OffTrigger;
          }
          break;
        case SonarState.OffTrigger:
          if (dist < TRIGGER_DIST) {
            sonarState = SonarState.OffTriggerEnd;
            configManager.setActive(false);
            await stopAudio();
          }
          break;
        case SonarState.OffTriggerEnd:
          if (dist > TRIGGER_DIST) {
            sonarState = SonarState.OnTrigger;
          }
          break;
      }
    };

    return {
      stateTick,
      playAudio,
      stopAudio,
      getSonarState: () => {
        return sonarState;
      },
      setStreamDataCallback: (cb) => {
        streamDataCallback = cb;
      },
    };
  } catch (e) {
    console.error(e);
    return undefined;
  }
};
