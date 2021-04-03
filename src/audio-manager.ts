const loader = require('audio-loader')
import play from "audio-play";

interface IAudioManager {
  welcome: () => void;
  bye: () => void;
}

export const audioManagerFactory = async (): Promise<IAudioManager> => {
  const aWelcome = await loader("./audio/atlantis.mp3");
  const aBye = await loader("./audio/nero.mp3");

  let playback: play.AudioPlayHandle;

  return {
    welcome: () => {
      playback = play(aWelcome, {}, () => {});
    },
    bye: () => {
      playback = play(aBye, {}, () => {});
    },
  };
};
