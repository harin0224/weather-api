const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const routes = require("./router");

// connection.connect(function(err){
//     if(err) throw err;
//     console.log("Connected!");
//   })
//connection.end();

app.use("/", routes);

app.listen(port, () => {
  console.log(`server is listening at localhost:${process.env.PORT}`);
});
