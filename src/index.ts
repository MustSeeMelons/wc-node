import { appLogicFactory } from "./app-loop-logic";
import { startServer } from "./express";
import { audioManagerFactory } from "./audio-manager";
import { ITick } from "./ticks/tick";
import { setupPowerButton } from "./ticks/power";
import { setupShutdownButton } from "./ticks/shutdown";
import { configManager } from "./config-manager";

(async () => {
  try {
    console.log("Starting..");
    const audioManager = await audioManagerFactory();
    const appLogic = await appLogicFactory(audioManager);

    const ticks: ITick[] = [
      setupPowerButton(appLogic.toggleAudio),
      setupShutdownButton(),
    ];

    startServer(audioManager, appLogic);

    ticks.forEach((t) => t.tick());
  } catch (e) {
    console.log("Failed..");
    console.log(e);
  }
})();
