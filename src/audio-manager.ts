import { wait } from "./utils";
import { AudioPlayHandle } from "audio-play";
import { configManager } from "./config-manager";
const loader = require("audio-loader");
const play = require("audio-play");
const { spawn } = require("child_process");

export const MIN_VOLUME = 30;
const MAX_VOLUME = 85;
const VOL_STEP = 9;
const VOL_WAIT = 125;

interface IAudioManager {
  startAudio: () => void;
  stopAudio: () => void;
}

export const setVolume = (volume: number) => {
  return new Promise<void>((resolve) => {
    const vol = spawn("amixer", ["set", "PCM", `${volume}%`]);
    vol.on("close", () => {
      resolve();
    });
  });
};

export const fadeInAudio = async () => {
  for (let i = MIN_VOLUME; i <= MAX_VOLUME; i += VOL_STEP) {
    await setVolume(i);
    await wait(VOL_WAIT);
  }
};

export const fadeOutAudio = async () => {
  for (let i = MAX_VOLUME; i >= MIN_VOLUME; i -= VOL_STEP) {
    await setVolume(i);
    await wait(VOL_WAIT);
  }
};

export const audioPlayManagerFactory = async (): Promise<
  IAudioManager | undefined
> => {
  try {
    const background = await loader(
      `resources/audio/${configManager.getFileName()}`
    );

    let playback: AudioPlayHandle = play(
      background,
      {
        autoplay: false,
        loop: true,
      },
      () => {}
    );

    return {
      startAudio: () => {
        playback.play();
      },
      stopAudio: () => {
        playback.pause();
      },
    };
  } catch (e) {
    console.error(e);
  }
};
