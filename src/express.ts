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
let currSong = "";

export const startServer = (audio: IAudioManager, logic: IAppLogic) => {
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
    const activeStreamId = configManager.getActiveStreamId();
    const streams = configManager.getStreamUrls();
    const min = configManager.getMinVolume();
    const max = configManager.getMaxVolume();
    const step = configManager.getVolStep();
    const isActive = configManager.isActive();
    const isSonarDisabled = configManager.isSonarDisabled();

    const audioFiles = readdirSync(path.join(__dirname, "/resources/audio"));

    res.render("index", {
      activeStreamId,
      streams,
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

  app.post("/add", async (req, res) => {
    const name = req.body["name"];
    const url = req.body["url"];

    const exists = configManager.getStreamUrls().some((stream) => {
      return stream.name === name || stream.url === url;
    });

    if (!exists) {
      configManager.addStreamUrl(name, url);
      res.redirect("/#success");
    } else {
      res.redirect("/#fail");
    }
  });

  app.post("/active", async (req, res) => {
    const id = req.body["id"];

    configManager.setActiveStreamId(id);

    if (configManager.isActive()) {
      await logic.stopAudio();
      await logic.playAudio();
    }

    res.sendStatus(200);
  });

  app.post("/delete", async (req, res) => {
    const id = req.body["id"];
    configManager.removeStreamUrl(id);
    const stream = configManager.getStreamUrls()[0];
    if (stream) {
      if (configManager.isActive()) {
        await logic.stopAudio();
        configManager.setActiveStreamId(stream.id);
        await logic.playAudio();
      }
    } else {
      configManager.setActiveStreamId("");
    }

    res.redirect("/#success");
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

    socket.emit("song", currSong);
  });

  httpServer.listen(PORT, () => {
    console.log(`API is up on: ${PORT}..`);
  });

  // Passing callback for socket data events
  logic &&
    logic.setStreamDataCallback((data) => {
      currSong = data;
      clients.forEach((client) => {
        client.emit("song", data);
      });
    });
};
