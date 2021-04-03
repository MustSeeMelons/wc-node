import { sonarStateFactory } from "./sonar-state";
import { configureClock, CLOCK_PWM } from "pigpio";

configureClock(1, CLOCK_PWM);

const pause = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 10)
  })
}

sonarStateFactory().then(async (sonarState) => {
  if (!sonarState) {
    console.log("soner no go brr brr");
  }

  console.log("Starting state loop!");

  while (true) {
    await sonarState.stateTick();
    await pause();
  }
});
