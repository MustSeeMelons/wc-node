const fs = require("fs-extra");
const path = require("path");

fs.copySync(
  path.join(__dirname, "/src/resources"),
  path.join(__dirname, "/dist/resources")
);
