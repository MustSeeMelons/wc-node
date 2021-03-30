import {} from "audio-play";
import { sonarFactory } from "./sonar";

console.log("start");

sonarFactory().then(async (sonar) => {
  if(!sonar) {
    console.log("soner borked");
  }

  while (true) {
    console.log("sample");
    const dist = await sonar.getDistance();
    console.log(dist);
  }
});

console.log("end");
