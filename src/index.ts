import { appLogicLoopFactory } from "./app-loop-logic";
import { configureClock, CLOCK_PWM } from "pigpio";
import { wait } from "./utils";
import { startServer } from "./express";
import { sonarFactory } from "./sonar";
import { audioManagerFactory } from "./audio-manager";

(async () => {
  // Fix ALSA audio isses caused by pigpio
  configureClock(1, CLOCK_PWM);

  const sonar = await sonarFactory();
  const audio = await audioManagerFactory();

  startServer(audio);

  appLogicLoopFactory(sonar, audio)
    .then(async (sonarState) => {
      if (!sonarState) {
        console.log("soner no go brr brr");
        return;
      } else {
        console.log("ha ha, we go brr brr");
      }

      while (true) {
        await sonarState.stateTick();
        await wait(100);
      }
    })
    .catch((e) => {
      console.error(e);
    });
})();
