const loader = require("audio-loader");
const play = require("audio-play");
const { exec, spawn } = require("child_process");

interface IAudioManager {
  welcome: () => void;
  bye: () => void;
}

const setVolume = (volume: number) => {
  return new Promise<void>((resolve) => {
    const vol = spawn("amixer", ["set", "PCM", `${i}%`]);
    vol.on("close", () => {
      resolve();
    });
  })
}

export const fadeInAudio = async () => {
  for(let i = MIN_VOLUME; i <= MAX_VOLUME; i += VOL_STEP) {
    await setVolume(i);
    await wait(VOL_WAIT);
  }
}

export const fadeOutAudio = async () => {
  for(let i = MAX_VOLUME; i >= MIN_VOLUME; i -= VOL_STEP) {
    await setVolume(i);
    await wait(VOL_WAIT);
  }
}

export const audioPlayManagerFactory = async (): Promise<
  IAudioManager | undefined
> => {
  try {
    const background = await loader("./audio/nero.mp3");

    let playback: play.AudioPlayHandle = play(
      background,
      {
        autoplay: false,
        volume: 1,
        loop: true,
      },
      () => {}
    );

    return {
      welcome: () => {
        playback.play();
      },
      bye: () => {
        playback.pause();
      },
    };
  } catch (e) {
    console.error(e);
  }
};
