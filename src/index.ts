import {} from "audio-play";
import { sonarFactory } from "./sonar";

console.log("start");

sonarFactory().then((sonar) => {
  while (true) {
    const dist = sonar.getDistance();
    console.log(dist);
  }
});

console.log("end");
