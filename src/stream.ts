import { spawn } from "child_process";
import { configManager } from "./config-manager";

export interface IAudioStream {
  close: () => void;
}

export const streamFactory = (cb: (data: string) => void) => {
  let id = configManager.getActiveStreamId();

  if (!id) {
    const stream = configManager.getStreamUrls()[0];
    id = stream.id;
    configManager.setActiveStreamId(id);
  }

  const stream = configManager
    .getStreamUrls()
    .find((stream) => stream.id === id);

  // Return nothing we we have nothing
  if (!stream) {
    return;
  }

  const st = spawn("mpg123", [stream.url]);

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
