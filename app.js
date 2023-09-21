const express = require("express");
const path = require("path");
const http = require("http");
const { routes } = require("./routes/configRoutes");
require("./db/mongoConnect");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
routes(app);

const server = http.createServer(app);
const port = process.env.PORT || 3001;
server.listen(port);
