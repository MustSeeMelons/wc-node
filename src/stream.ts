import { spawn } from "child_process";
import { configManager } from "./config-manager";

export interface IAudioStream {
  close: () => void;
}

export const streamFactory = (cb: (data: string) => void) => {
  const st = spawn("mpg123", [configManager.getStreamUrl()]);

  st.stdout.on("data", (data) => {
    cb(data);
  });

  return {
    close: () => {
      st.kill();
    },
  };
};
