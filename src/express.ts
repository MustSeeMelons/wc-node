import express, { Application } from "express";
import fileUpload, { UploadedFile } from "express-fileupload";
import path from "path";
import { readdirSync } from "fs";
import { configManager } from "./config-manager";
import { IAudioManager } from "./audio-manager";

const PORT = 8080;

export const startServer = (audio: IAudioManager) => {
  const app: Application = express();

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "/resources"));

  app.use(fileUpload());

  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  app.use(
    "/favicon.ico",
    express.static(path.join(__dirname, "/resources/favicon.ico"))
  );

  app.get("/:success?", async (req, res) => {
    const url = configManager.getStreamUrl();
    const isStream = configManager.isStream();
    const filename = configManager.getFileName();

    const audioFiles = readdirSync(path.join(__dirname, "/resources/audio"));

    res.render("index", {
      url,
      filename,
      success: req.params.success,
      isStream,
      audioFiles,
    });
  });

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
      res.redirect("/true");
    } else {
      res.redirect("/false");
    }
  });

  app.listen(PORT, () => {
    console.log(`Server is up on: ${PORT}, wait for soner..`);
  });
};
