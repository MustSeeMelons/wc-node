import { appLogicFactory } from "./app-loop-logic";
import { wait } from "./utils";
import { startServer } from "./express";
import { audioManagerFactory } from "./audio-manager";
import { ITick } from "./ticks/tick";
import { setupPowerButton } from "./ticks/power";
import { setupRotary } from "./ticks/rotary";

(async () => {
  try {
    console.log("Starting..");
    const audio = await audioManagerFactory();
    const appLogic = await appLogicFactory(audio);

    const ticks: ITick[] = [
      setupPowerButton(appLogic.toggleAudio),
      setupRotary((up) => {
        if (up) {
          audio.increaseVolume();
        } else {
          audio.decreaseVolume();
        }
      }),
    ];

    startServer(audio, appLogic);

    await wait(2000);
    console.log("Started..");

    while (true) {
      for (let t of ticks) {
        t.tick();
      }
      await wait(20);
    }
  } catch (e) {
    console.log("Failed..");
    console.log(e);
  }
})();

const clinUp = () => {
  // terminate();
};

process.on("exit", clinUp);

// Ctrl+c event
process.on("SIGINT", clinUp);

// Catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", clinUp);
process.on("SIGUSR2", clinUp);

// Uncaught exceptions
process.on("uncaughtException", clinUp);
