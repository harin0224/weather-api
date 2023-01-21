const express = require("express");
const router = express.Router();
const axios = require("axios");
const moment = require("moment");

//const dotenv = require("dotenv");
const mysql = require("mysql2/promise");

//dotenv.config();

/*env 연결*/
require("dotenv").config({ path: "./env/.env.local" });
console.log("DATABASE_USERNAME: ", process.env.DATABASE_USERNAME);
console.log("DATABASE_PASSWORD: ", process.env.DATABASE_PASSWORD);
console.log("DATABASE_NAME: ", process.env.DATABASE_NAME);
console.log("DATABASE_URL: ", process.env.DATABASE_URL);

/*DB 연결*/
const connection = mysql.createPool({
  host: process.env.DATABASE_URL || "localhost",
  user: process.env.DATABASE_USERNAME || "root",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "learnsql",
});

/*서버 라우터*/
router.get("/", async (req, res) => {
  const con = await connection.getConnection();
  const { code } = req.query;

  let [rows, fields] = await con.query(
    "SELECT * FROM short_range_forecast WHERE administrative_district_code =" +
      code
  );

  const grid_X = rows[0].grid_X;
  const grid_Y = rows[0].grid_Y;
  const date = moment();
  const base_date = date.format("YYYYMMDD");
  const time = date.format("HH") + "00";
  const base_time_list = [
    "0200",
    "0500",
    "0800",
    "1100",
    "1400",
    "1700",
    "2000",
    "2300",
  ];
  let base_time;

  for (let i = 0; i < base_time_list.length; i++) {
    if (time < base_time_list[i]) {
      base_time = base_time_list[i - 1];
      break;
    }
  }

  //console.log(base_date, base_time);

  const params = {
    nx: grid_X,
    ny: grid_Y,
    serviceKey: process.env.WEATHER_SERVICEKEY,
    dataType: "JSON",
    base_date,
    base_time,
    numOfRows: 5000,
  };

  //console.log(params);
  let url =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?";

  for (const key of Object.keys(params)) {
    url += `${key}=${params[key]}&`;
  }
  url = url.slice(0, -1);

  const { data } = await axios.get(url);

  //console.log(data.response.body.items);
  //res.status(202).send({data});

  const weatherInfo = {};

  for (const key of data.response.body.items.item) {
    const datakey = key.fcstDate + key.fcstTime;
    weatherInfo[datakey] = weatherInfo[datakey] || {};

    weatherInfo[datakey].code = code;

    weatherInfo[datakey].data = weatherInfo[datakey].data || [];
    weatherInfo[datakey].data.push({
      category: key.category,
      value: key.fcstValue,
    });
  }
  //console.log(weatherInfo[202301211800].data);

  res.status(202).send(weatherInfo);
});

module.exports = router;
