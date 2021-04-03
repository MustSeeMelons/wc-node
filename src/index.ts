import { sonarStateFactory } from "./sonar-state";
import { configureClock, CLOCK_PWM } from "pigpio";

configureClock(1, CLOCK_PWM);

sonarStateFactory()
  .then(async (sonarState) => {
    if (!sonarState) {
      console.log("soner no go brr brr");
    } else {
      console.log("ha ha, we go brr brr");
    }

    while (true) {
      await sonarState.stateTick();
    }
  })
  .catch((e) => {
    console.error(e);
  });
