import { IAudioManager } from "./audio-manager";
import { fadeInAudio, fadeOutAudio, setVolume } from "./audio-manager";
import { IAudioStream, streamFactory } from "./stream";
import { Gpio } from "pigpio";
import { configManager } from "./config-manager";
import { wait } from "./utils";

const PIN_LED = 5;

let isPlaying = false;

export interface IAppLogic {
  playAudio: () => Promise<void>;
  stopAudio: () => Promise<void>;
  toggleAudio: () => void;
  setStreamDataCallback: (cb: (data: string) => void) => void;
}

let streamDataCallback: (data: string) => void;

export const appLogicFactory = async (
  audio: IAudioManager
): Promise<IAppLogic | undefined> => {
  try {
    await setVolume(configManager.getMinVolume());

    let stream: IAudioStream | undefined;
    const led = new Gpio(PIN_LED, { mode: Gpio.OUTPUT });

    let isLedOn = false;
    led.digitalWrite(0);

    const setLedState = (value: boolean) => {
      led.digitalWrite(value ? 1 : 0);
      isLedOn = value;
    };

    const playAudio = async () => {
      setLedState(true);
      if (stream) {
        stream.close();
      }

      stream = streamFactory(streamDataCallback);

      // The stream might not start immediately, wait a little
      // Otherwise it can start at full volume which is not that nice
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 1500);
      });

      await fadeInAudio();
    };

    const stopAudio = async () => {
      setLedState(false);
      await fadeOutAudio();
      stream && stream.close();
    };

    const toggleAudio = () => {
      if (isPlaying) {
        stopAudio();
        isPlaying = false;
      } else {
        playAudio();
        isPlaying = true;
      }
    };

    return {
      playAudio,
      stopAudio,
      toggleAudio,
      setStreamDataCallback: (cb) => {
        streamDataCallback = cb;
      },
    };
  } catch (e) {
    console.error(e);
    return undefined;
  }
};
