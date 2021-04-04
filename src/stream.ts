import { spawn } from "child_process";
import { configManager } from "./config-manager";

export interface IAudioStream {
  close: () => void;
}

export const streamFactory = () => {
  const st = spawn("mpg123", [configManager.getStreamUrl()]);

  return {
    close: () => {
      st.kill();
    },
  };
};
