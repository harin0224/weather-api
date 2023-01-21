const express = require("express");
const router = express.Router();

const shortWeather = require("./short-weather.js");

router.use("/short-weather", shortWeather);

module.exports = router;
