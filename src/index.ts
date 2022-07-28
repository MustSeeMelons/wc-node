import { appLogicFactory } from "./app-loop-logic";
import { configureClock, CLOCK_PWM } from "pigpio";
import { wait } from "./utils";
import { startServer } from "./express";
import { sonarFactory } from "./sonar";
import { audioManagerFactory } from "./audio-manager";
import { configManager } from "./config-manager";
import { setupPowerButton } from "./power";
import { setupRotary } from "./rotary";

(async () => {
  // Fix ALSA audio isses caused by pigpio
  configureClock(1, CLOCK_PWM);

  try {
    console.log("Starting..");
    const sonar = await sonarFactory();
    const audio = await audioManagerFactory();
    setupRotary();
    setupPowerButton();
    const appLogic = await appLogicFactory(sonar, audio);

    startServer(audio, appLogic);
    console.log("Started..");

    while (true) {
      if (!configManager.isSonarDisabled()) {
        await appLogic.stateTick();
      } else {
        // Sonar will eat up all cycles if you let it
        await wait(50);
      }
      await wait(50);
    }
  } catch (e) {
    console.log("Failed..");
    console.log(e);
  }
})();
