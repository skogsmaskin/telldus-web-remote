import {getDevices, getSensors, dim, turnOn, turnOff} from './lib/backend/telldus';

import express from "express";
import bodyParser from 'body-parser';

const router = express.Router();
export default router;

router.use(bodyParser.json());

const ALLOWED_COMMANDS = {dim, turnOn, turnOff};

function error(id, message) {
  return {error: {message, id}};
}

router.post("/devices/:deviceId/command", function (req, res) {
  const deviceId = Number(req.params.deviceId);
  const command = req.body;

  if (!ALLOWED_COMMANDS.hasOwnProperty(command.name)) {
    return res
      .status(403)
      .json(error('invalid-command', `Invalid command ${JSON.stringify(command.name)}`))
  }

  const args = [deviceId].concat(command.arguments || []);

  const p = ALLOWED_COMMANDS[command.name](...args);
  if (p) {
    console.log("Committed command")
    return p.then(() => {
      res.status(200).json({status: "ok"})
    })
      .catch(err => {
        res.status(500).json(error('command-failed', err.message))
      });
  }
  return res.status(200).json({status: "pending"})
});

router.get("/devices", function (req, res) {
  getDevices()
    .then(devices => {
      res.status(200).json(devices)
    })
    .catch(err => {
      res.status(500).json(error('get-devices-failed', err.message));
    })
});

router.get("/sensors", function (req, res) {
  getSensors()
    .then(sensors => {
      res.status(200).json(sensors)
    })
    .catch(err => {
      res.status(500).json(error('get-sensors-failed', err.message));
    })
});