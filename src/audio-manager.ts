import { wait } from "./utils";
import { configManager } from "./config-manager";
const { spawn } = require("child_process");

const VOL_WAIT = 125;

export interface IAudioManager {
  setVolume: (volume: number) => void;
}

export const setVolume = (volume: number) => {
  return new Promise<void>((resolve) => {
    const vol = spawn("amixer", ["set", "PCM", `${volume}%`]);
    vol.on("close", () => {
      resolve();
    });
    vol.on("error", (e) => {
      console.error(e);
    });
  });
};

export const fadeInAudio = async () => {
  for (
    let i = configManager.getMinVolume();
    i <= configManager.getMaxVolume();
    i += configManager.getVolStep()
  ) {
    await setVolume(i);
    await wait(VOL_WAIT);
  }
};

export const fadeOutAudio = async () => {
  for (
    let i = configManager.getMaxVolume();
    i >= configManager.getMinVolume();
    i -= configManager.getVolStep()
  ) {
    await setVolume(i);
    await wait(VOL_WAIT);
  }
};

export const audioManagerFactory = async (): Promise<
  IAudioManager | undefined
> => {
  try {
    return {
      setVolume: (volume: number) => {
        setVolume(volume);
      },
    };
  } catch (e) {
    console.error(e);
  }
};
