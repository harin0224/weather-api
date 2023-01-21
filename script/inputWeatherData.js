//const { json } = require('express');
const mysql = require('mysql2');
const xlsx = require('xlsx');
const workbook = xlsx.readFile('../public/단기예보.xlsx');
const data = workbook.Sheets['최종 업데이트 파일_20221027'];
  //console.log(data);
const  jsonData= xlsx.utils.sheet_to_json( data, { defval : "" } );
  //console.log(jsonData);
  //console.log(jsonData[0]);
  //console.log(Object.keys(jsonData[0]));

require("dotenv").config({path: "../env/.env.local"});
console.log("DATABASE_USERNAME: ", process.env.DATABASE_USERNAME);
console.log("DATABASE_PASSWORD: ", process.env.DATABASE_PASSWORD);
console.log("DATABASE_NAME: ", process.env.DATABASE_NAME);
console.log("DATABASE_URL: ", process.env.DATABASE_URL);

/*jsonData 값 배열에 넣기*/
 const list = [];
 for(let i = 0; i<jsonData.length; i++){
  list[i] = [];

  // console.log(`i 번째`, i);
  // console.log(`i 번째 data`, Object.keys(jsonData[i]));

  for (const key of Object.keys(jsonData[i])){
    const val = jsonData[i][key];
    if (key == '행정구역코드'){
      list[i].push(val);
    }
    else if (key == '1단계'){
      list[i].push(val);
    }
    else if (key == '2단계'){
      list[i].push(val);
    }
    else if (key == '3단계'){
      list[i].push(val);
    }
    else if (key == '격자 X'){
      list[i].push(val);
    }
    else if (key == '격자 Y'){
      list[i].push(val);
    }
    else if (key == '경도(시)'){
      list[i].push(val);
    }
    else if (key == '경도(분)'){
      list[i].push(val);
    }
    else if (key == '경도(초)'){
      list[i].push(val);
    }
    else if (key == '위도(시)'){
      list[i].push(val);
    }
    else if (key == '위도(분)'){
      list[i].push(val);
    }
    else if (key == '위도(초)'){
      list[i].push(val);
    }
  }
 } 
//console.log(list[1]);


const connection = mysql.createConnection({
  host     : process.env.DATABASE_URL || 'localhost',
  user     : process.env.DATABASE_USERNAME || 'root',
  password : process.env.DATABASE_PASSWORD || '',
  database : process.env.DATABASE_NAME || 'learnsql'
});

/*DB에 Data 넣기*/
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    const sql = `INSERT INTO 
    short_range_forecast (administrative_district_code, 
    adress_1, adress_2, adress_3, grid_X, grid_Y, 
    long_hour, long_minute, long_second, 
    lat_hour, lat_minute, lat_second) 
    VALUES ?`;

    const values = list

    connection.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
      });
    });
  