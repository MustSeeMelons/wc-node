import { sonarStateFactory } from "./sonar-state";
import { configureClock, CLOCK_PWM } from "pigpio";

configureClock(2, CLOCK_PWM);

const pause = () => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 10);
  });
};

sonarStateFactory()
  .then(async (sonarState) => {
    if (!sonarState) {
      console.log("soner no go brr brr");
    }

    while (true) {
      await sonarState.stateTick();
      // await pause();
    }
  })
  .catch((e) => {
    console.error(e);
  });
