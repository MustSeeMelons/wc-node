import { sonarStateFactory } from "./sonar-state";
import { configureClock, CLOCK_PWM } from "pigpio";
import { wait } from "./utils";
import { startServer } from "./express";

startServer();

// configureClock(1, CLOCK_PWM);

// sonarStateFactory()
//   .then(async (sonarState) => {
//     if (!sonarState) {
//       console.log("soner no go brr brr");
//       return;
//     } else {
//       console.log("ha ha, we go brr brr");
//     }

//     while (true) {
//       await sonarState.stateTick();
//       await wait(100);
//     }
//   })
//   .catch((e) => {
//     console.error(e);
//   });
