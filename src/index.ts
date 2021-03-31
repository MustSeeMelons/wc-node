import {} from "audio-play";
import { sonarStateFactory } from "./sonar-state";

const sleep = require("sleep");

sonarStateFactory().then(async (sonarState) => {
  if(!sonarState) {
    console.log("soner no go brr");
  }

  while (true) {
    await sonarState.stateTick();
    console.log(sonarState.getSonarState());
    // sleep.msleep(50);
  }
});

