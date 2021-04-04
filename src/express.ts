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

    res.render("index", {
      url,
      filename: "", // it will replace comments too
      success: req.params.success,
    });
  });

  app.post("/update", (req, res) => {
    const url = req.body["url"];
    if (url) {
      configManager.setStreamUrl(url);
      res.redirect("/true");
    } else {
      res.redirect("/false");
    }
  });

  app.listen(PORT, () => {
    console.log(`Server is up on: ${PORT}`);
  });
};
