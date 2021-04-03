import loader from "audio-loader";
import play from "audio-play";

interface IAudioManager {
  welcome: () => void;
  bye: () => void;
}

export const audioManagerFactory = async (): Promise<IAudioManager> => {
  const aWelcome = await loader("./audio/welcome.mp3");
  const aBye = await loader("./autio/bye.mp3");

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
