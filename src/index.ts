import { appLogicFactory } from "./app-loop-logic";
import { configureClock, CLOCK_PWM, CLOCK_PCM, terminate } from "pigpio";
import { wait } from "./utils";
import { startServer } from "./express";
import { audioManagerFactory } from "./audio-manager";
import { configManager } from "./config-manager";
import { ITick } from "./ticks/tick";
import { setupPowerButton } from "./ticks/power";
import { setupRotary } from "./ticks/rotary";

// Fix ALSA audio isses caused by pigpio
configureClock(1, CLOCK_PWM);
// configureClock(1, CLOCK_PCM);

(async () => {
  try {
    console.log("Starting..");
    const audio = await audioManagerFactory();
    const appLogic = await appLogicFactory(audio);

    const ticks: ITick[] = [
      // setupPowerButton(appLogic.toggleAudio),
      setupRotary((up) => {
        if (up) {
          audio.increaseVolume();
        } else {
          audio.decreaseVolume();
        }
      }),
    ];

    startServer(audio, appLogic);
    console.log("Started..");

    while (true) {
      ticks.forEach((t) => t.tick());
      await wait(20);
    }
  } catch (e) {
    console.log("Failed..");
    console.log(e);
  }
})();

const clinUp = () => {
  terminate();
};

process.on("exit", clinUp);

// Ctrl+c event
process.on("SIGINT", clinUp);

// Catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", clinUp);
process.on("SIGUSR2", clinUp);

// Uncaught exceptions
process.on("uncaughtException", clinUp);
