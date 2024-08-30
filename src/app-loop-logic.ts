import { IAudioManager } from "./audio-manager";
import { fadeInAudio, fadeOutAudio, setVolume } from "./audio-manager";
import { IAudioStream, streamFactory } from "./stream";
import { Gpio, configureClock, CLOCK_PWM, terminate } from "pigpio";
import { configManager } from "./config-manager";
import { setLedState, getLedState, setLedBrightness } from "./led";

configureClock(1, CLOCK_PWM);

let isPlaying = false;

export interface IAppLogic {
  playAudio: () => Promise<void>;
  stopAudio: () => Promise<void>;
  toggleAudio: () => void;
  setStreamDataCallback: (cb: (data: string) => void) => void;
  isPlaying: () => boolean;
  setLedBrightness: (value: number) => void;
}

let streamDataCallback: (data: string) => void;

export const appLogicFactory = async (
  audio: IAudioManager
): Promise<IAppLogic | undefined> => {
  try {
    await setVolume(configManager.getMinVolume());

    let stream: IAudioStream | undefined;

    const playAudio = async () => {
      isPlaying = true;
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

      // audio.setMaxVolume();
    };

    const stopAudio = async () => {
      setLedState(false);
      isPlaying = false;
      await fadeOutAudio();
      stream && stream.close();
    };

    const toggleAudio = () => {
      if (isPlaying) {
        stopAudio();
      } else {
        playAudio();
      }
    };

    return {
      playAudio,
      stopAudio,
      toggleAudio,
      setStreamDataCallback: (cb) => {
        streamDataCallback = cb;
      },
      isPlaying: () => isPlaying,
      setLedBrightness: (value: number) => {
        if (getLedState()) {
          setLedBrightness(value);
        }
      },
    };
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

process.on("SIGINT", function () {
  terminate();
  process.exit();
});
