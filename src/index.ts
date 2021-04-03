import { sonarStateFactory } from "./sonar-state";

sonarStateFactory().then(async (sonarState) => {
  if (!sonarState) {
    console.log("soner no go brr");
  }

  while (true) {
    await sonarState.stateTick();
  }
});
