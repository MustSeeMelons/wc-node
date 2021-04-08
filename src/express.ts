import express, { Application, Request, Response } from "express";
import fileUpload, { UploadedFile } from "express-fileupload";
import path from "path";
import { readdirSync } from "fs";
import { configManager } from "./config-manager";
import { IAudioManager } from "./audio-manager";
import { IAppLogic } from "./app-loop-logic";
import { dateToString } from "./utils";

const PORT = 8080;

export const startServer = (audio: IAudioManager, logic: IAppLogic) => {
  const up = dateToString();
  const app: Application = express();

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "/resources"));

  app.use(fileUpload());
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  app.use("/public", express.static(path.join(__dirname, "/resources/public")));

  const postHandler = (success: string) => async (
    req: Request,
    res: Response
  ) => {
    const url = configManager.getStreamUrl();
    const isStream = configManager.isStream();
    const filename = configManager.getFileName();
    const min = configManager.getMinVolume();
    const max = configManager.getMaxVolume();
    const step = configManager.getVolStep();
    const isActive = configManager.isActive();

    const audioFiles = readdirSync(path.join(__dirname, "/resources/audio"));

    res.render("index", {
      url,
      filename,
      success: success,
      isStream,
      audioFiles,
      min,
      max,
      step,
      on: isActive ? "active" : "",
      off: !isActive ? "active" : "",
      up: up,
    });
  };

  app.get("/", postHandler(""));
  app.get("/success", postHandler("true"));
  app.get("/fail", postHandler("false"));

  app.post("/update", async (req, res) => {
    const url = req.body["url"];
    const playStream = req.body["isStream"] === "on";
    const audioFile = req.body["audioFile"];

    if (req.files) {
      const file = req.files.file as UploadedFile;
      const uploadPath = __dirname + "/resources/audio/" + file.name;
      configManager.setFileName(file.name);
      await file.mv(uploadPath);
    } else if (audioFile) {
      configManager.setFileName(audioFile);
    }

    url && configManager.setStreamUrl(url);
    configManager.setStream(playStream);

    if (url || playStream || audioFile || req.files) {
      res.redirect("/#success");
    } else {
      res.redirect("/#fail");
    }
  });

  app.post("/volume", (req, res) => {
    const type = req.body["type"];
    const val = req.body["value"];

    if (type && val !== undefined) {
      switch (type) {
        case "max":
          configManager.setMaxVolume(+val);
          audio.setVolume(+val);
          break;
        case "min":
          configManager.setMinVolume(+val);
          break;
        case "step":
          configManager.setVolStep(+val);
          break;
      }
    }

    res.sendStatus(200);
  });

  app.post("/state", (req, res) => {
    const value = !!req.body["value"];
    configManager.setActive(value);

    if (value) {
      logic.playAudio();
    } else {
      logic.stopAudio();
    }

    res.sendStatus(200);
  });

  app.listen(PORT, () => {
    console.log(`API is up on: ${PORT}..`);
  });
};
