import { appLogicFactory } from "./app-loop-logic";
import { configureClock, CLOCK_PWM } from "pigpio";
import { wait } from "./utils";
import { startServer } from "./express";
import { sonarFactory } from "./sonar";
import { audioManagerFactory } from "./audio-manager";
import { configManager } from "./config-manager";

(async () => {
  // Fix ALSA audio isses caused by pigpio
  configureClock(1, CLOCK_PWM);

  try {
    console.log("Starting..");
    const sonar = await sonarFactory();
    const audio = await audioManagerFactory();
    const appLogic = await appLogicFactory(sonar, audio);

    startServer(audio, appLogic);
    console.log("Started..");

    while (true) {
      if (!configManager.isSonarDisabled()) {
        await appLogic.stateTick();
      } else {
        await wait(100);
      }
      await wait(100);
    }
  } catch (e) {
    console.log("Failed..");
    console.log(e);
  }
})();
