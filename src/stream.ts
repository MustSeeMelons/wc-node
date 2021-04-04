import { spawn } from "child_process";

export interface IAudioStream {
  close: () => void;
}

export const streamFactory = () => {
  const st = spawn("mpg123", ["http://ice1.somafm.com/u80s-128-mp3"]);

  return {
    close: () => {
      st.disconnect();
    },
  };
};
