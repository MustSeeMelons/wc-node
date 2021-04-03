import { sonarStateFactory } from "./sonar-state";
import { configureClock, CLOCK_PWM } from "pigpio";

console.log("configuring clock");

configureClock(4, CLOCK_PWM);

console.log("clock configured");

const pause = () => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 10);
  });
};

console.log("creating sonar factory");

sonarStateFactory()
  .then(async (sonarState) => {
    if (!sonarState) {
      console.log("soner no go brr brr");
    }

    console.log("Starting state loop!");

    while (true) {
      console.log("looper");
      await sonarState.stateTick();
      await pause();
    }
  })
  .catch((e) => {
    console.error(e);
  });
