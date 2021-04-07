import { appLogicFactory } from "./app-loop-logic";
import { configureClock, CLOCK_PWM } from "pigpio";
import { wait } from "./utils";
import { startServer } from "./express";
import { sonarFactory } from "./sonar";
import { audioManagerFactory } from "./audio-manager";

(async () => {
  // Fix ALSA audio isses caused by pigpio
  // configureClock(1, CLOCK_PWM);

  try {
    console.log("Starting..");
    // const sonar = await sonarFactory();
    // const audio = await audioManagerFactory();
    // const appLogic = await appLogicFactory(sonar, audio);

    // startServer(audio, appLogic);
    startServer();

    console.log("Started..");

    // while (true) {
    //   await appLogic.stateTick();
    //   await wait(100);
    // }
  } catch (e) {
    console.log("Failed..");
    console.log(e);
  }
})();
