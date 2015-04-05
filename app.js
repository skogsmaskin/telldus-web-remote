import express from 'express';
import path from 'path';
import config from "./config";
import fs from "fs";
import helmet from 'helmet';
import Bluebird from 'bluebird';
import quickreload from "quickreload";
import serve from "staticr/serve";
import capture from "error-capture-middleware";

let app = express();

export default app;

app.use(helmet());

if (config.env === 'development') {
  app.use(quickreload());
}

if (config.env === 'development') {
  app.use(serve(require("./static-routes")));
}

if (config.env === 'development') {
  app.use("/", capture.js());
  app.use("/", capture.css());
}

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', require("./api"));
app.use('/api/realtime', require("./api"));

import {deviceEvents, getSensors, getDevices} from "./lib/backend/telldus"

import React from "react";
import Layout from "./components/Layout.jsx";

app.get("/", function(req, res, next) {
  Bluebird.join(getSensors(), getDevices()).spread((sensors, devices) => {
    res.status(200).send(React.renderToString(<Layout sensors={sensors} devices={devices}/>))
  })
  .catch(next)
});
