const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors");
const {connectDB} = require('./Components/Middleware/dbConnect');

const app = express()
const port = process.env.PORT || 5000;

app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Listen on enviroment port or 5000
app.listen(port, () => console.log(`Listening on port ${port}`))