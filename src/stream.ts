import { spawn } from "child_process";
import { configManager } from "./config-manager";

export interface IAudioStream {
  close: () => void;
}

export const streamFactory = (cb: (data: string) => void) => {
  const st = spawn("mpg123", [configManager.getStreamUrl()], {
    stdio: "pipe",
  });

  const listen = (data: string) => {
    if (data.indexOf("StreamTitle") >= 0) {
      const titleSegment = data.split(";")[0];
      const sIndex = titleSegment.indexOf("'");
      const lIndex = titleSegment.indexOf("'");

      cb(titleSegment.substring(sIndex, lIndex));
    }
  };

  process.stdout.on("data", listen);

  return {
    close: () => {
      process.stdout.removeListener("data", listen);
      st.kill();
    },
  };
};
