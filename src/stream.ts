import { spawn } from "child_process";
import { configManager } from "./config-manager";

export interface IAudioStream {
  close: () => void;
}

export const streamFactory = (cb: (data: string) => void) => {
  const st = spawn("mpg123", [configManager.getStreamUrl()]);

  const listen = (data) => {
    const sData = data.toString();
    if (sData.indexOf("StreamTitle=") >= 0) {
      const titleSegment = sData.split(";")[0];
      const sIndex = titleSegment.indexOf("'");
      const lIndex = titleSegment.lastIndexOf("'");

      const result = titleSegment.substring(sIndex + 1, lIndex);

      cb(result);
    }
  };

  st.stderr.on("data", listen);

  return {
    close: () => {
      st.kill();
    },
  };
};
