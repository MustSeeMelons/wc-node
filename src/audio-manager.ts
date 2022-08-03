import { wait } from "./utils";
import { configManager } from "./config-manager";
const { spawn } = require("child_process");

const VOL_WAIT = 125;

let currVolume = configManager.getMaxVolume();

export interface IAudioManager {
  setVolume: (volume: number) => void;
  increaseVolume: () => void;
  decreaseVolume: () => void;
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
    let i = configManager.getMaxVolume() - 1;
    i >= configManager.getMinVolume();
    i -= configManager.getVolStep()
  ) {
    await setVolume(i);
    await wait(VOL_WAIT);
  }
};

export const audioManagerFactory = async (): Promise<IAudioManager> => {
  try {
    return {
      setVolume: (volume: number) => {
        setVolume(volume);
      },
      increaseVolume: () => {
        currVolume += 1;
        currVolume %= 100;
        configManager.setMaxVolume(currVolume);

        setVolume(currVolume);
      },
      decreaseVolume: () => {
        currVolume -= 1;
        if (currVolume < configManager.getMinVolume()) {
          currVolume = configManager.getMinVolume();
        }

        setVolume(currVolume);
      },
    };
  } catch (e) {
    console.error(e);
  }
};
