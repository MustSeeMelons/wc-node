import express, { Application, Request, Response } from "express";
import path from "path";
import { readdirSync } from "fs";
import { configManager } from "./config-manager";
import { IAudioManager } from "./audio-manager";
import { IAppLogic } from "./app-loop-logic";
import { dateToString } from "./utils";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
const { exec } = require("child_process");

const PORT = 8080;

let clients: Socket[] = [];

export const startServer = (
  audio: IAudioManager = undefined,
  logic: IAppLogic = undefined
) => {
  const up = dateToString();
  const app: Application = express();

  const httpServer = createServer(app);

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "/resources"));

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
    const min = configManager.getMinVolume();
    const max = configManager.getMaxVolume();
    const step = configManager.getVolStep();
    const isActive = configManager.isActive();
    const isSonarDisabled = configManager.isSonarDisabled();

    const audioFiles = readdirSync(path.join(__dirname, "/resources/audio"));

    res.render("index", {
      url,
      success: success,
      audioFiles,
      min,
      max,
      step,
      on: isActive ? "active" : "",
      off: !isActive ? "active" : "",
      up,
      enableSonar: !isSonarDisabled ? "active" : "",
      disableSonar: isSonarDisabled ? "active" : "",
    });
  };

  app.get("/", postHandler(""));
  app.get("/success", postHandler("true"));
  app.get("/fail", postHandler("false"));

  app.post("/update", async (req, res) => {
    const url = req.body["url"];

    url && configManager.setStreamUrl(url);

    if (url) {
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

  app.post("/sonar", (req, res) => {
    const value = !!req.body["value"];
    configManager.setSonarDisabled(value);
    res.sendStatus(200);
  });

  app.get("/reboot", (req, res) => {
    res.sendStatus(200);
    exec("systemctl restart ateja");
  });

  app.get("/shutdown", (req, res) => {
    res.sendStatus(200);
    exec("sudo shutdown -h now");
  });

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    clients.push(socket);

    socket.on("disconnect", () => {
      clients = clients.filter((c) => c !== socket);
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`API is up on: ${PORT}..`);
  });

  // Passing callback for socket data events
  logic.setStreamDataCallback((data) => {
    clients.forEach((client) => {
      client.emit(data);
    });
  });
};
