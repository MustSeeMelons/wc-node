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
        if (appLogic.isPlaying()) {
          if (up) {
            audio.increaseVolume();
          } else {
            audio.decreaseVolume();
          }
        }
      }),
    ];

    startServer(audio, appLogic);

    await wait(2000);
    console.log("Started..");

    ticks.forEach((t) => t.tick());
  } catch (e) {
    console.log("Failed..");
    console.log(e);
  }
})();
