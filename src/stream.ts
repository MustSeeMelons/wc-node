import { spawn } from "child_process";
import { configManager } from "./config-manager";

export interface IAudioStream {
  close: () => void;
}

export const streamFactory = (cb: (data: string) => void) => {
  try {
    const st = spawn("mpg123", [configManager.getStreamUrl()]);

    st.stdout.pipe(process.stdout)

    st.stdout.on("data", (data) => {
      console.log(data);
      // cb(data);
    });

    return {
      close: () => {
        try {
          st.kill("SIGINT");
        } catch(e) {
          console.log(e);
        }
      },
    };
  } catch (e) {
    console.log(e);
  }
};
