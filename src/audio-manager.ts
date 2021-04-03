const loader = require("audio-loader");
const play = require("audio-play");

interface IAudioManager {
  welcome: () => void;
  bye: () => void;
}

export const audioManagerFactory = async (): Promise<IAudioManager | undefined> => {
  try {
    const background = await loader("./audio/nero.mp3");

    let playback: play.AudioPlayHandle;

    const createPlayback = () => {
      playback = play(background, {
        autoplay: false,
        volume: 1
      }, () => {
        createPlayback();
      });
    }

    createPlayback();

    return {
      welcome: () => {
        playback.play();
      },
      bye: () => {
        playback.pause();
      },
    };
  } catch(e) {
    console.error(e);
  }
};
