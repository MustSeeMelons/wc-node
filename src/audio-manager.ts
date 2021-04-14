import path from "path";
import { wait } from "./utils";
import { AudioPlayHandle } from "audio-play";
import { configManager } from "./config-manager";
const loader = require("audio-loader");
const play = require("audio-play");
const { spawn } = require("child_process");

const VOL_WAIT = 125;

export interface IAudioManager {
  startAudio: () => void;
  stopAudio: () => void;
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
    // TODO This is veeeery slow.. - in the bin?
    // const background = await loader(
    //   path.join(__dirname, `/resources/audio/${configManager.getFileName()}`)
    // );

    // let playback: AudioPlayHandle = play(
    //   background,
    //   {
    //     autoplay: false,
    //     loop: true,
    //   },
    //   () => {}
    // );

    return {
      startAudio: () => {
        // playback.play();
      },
      stopAudio: () => {
        // playback.pause();
      },
      setVolume: (volume: number) => {
        setVolume(volume);
      },
    };
  } catch (e) {
    console.error(e);
  }
};
