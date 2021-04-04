import express, { Application } from "express";
import path from "path";
import { configManager } from "./config-manager";

const PORT = 8080;

export const startServer = () => {
  const app: Application = express();

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "/resources"));

  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  app.get("/:success?", (req, res) => {
    const url = configManager.getStreamUrl();
    const isStream = configManager.isStream();

    res.render("index", {
      url,
      filename: "", // it will replace comments too
      success: req.params.success,
      isStream,
    });
  });

  app.post("/update", (req, res) => {
    const url = req.body["url"];
    const playStream = req.body["isStream"] === "on";

    url && configManager.setStreamUrl(url);
    configManager.setStream(playStream);

    if (url || playStream) {
      res.redirect("/true");
    } else {
      res.redirect("/false");
    }
  });

  app.listen(PORT, () => {
    console.log(`Server is up on: ${PORT}, wait for soner..`);
  });
};
