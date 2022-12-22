const mongoose = require("mongoose");
let alert = require("alert");
var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var path = require("path");
var app = express();

mongoose.connect("mongodb://localhost:27017/users");
var db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error"));
db.once("open", function (callback) {
  console.log("connection succeeded");
});

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use('/api/users', users);
// app.use('/api/auth',auth);

app.get("/", function (req, res) {
  res.render("login");
});
app.get("/annapurna", function (req, res) {
  res.render("annapurna");
});
app.get("/bali", function (req, res) {
  res.render("bali");
});

app.get("/cities", function (req, res) {
  res.render("cities");
});

app.get("/hiking", function (req, res) {
  res.render("hiking");
});
app.get("/home", function (req, res) {
  res.render("home");
});
app.get("/inca", function (req, res) {
  res.render("inca");
});
app.get("/islands", function (req, res) {
  res.render("islands");
});
app.get("/paris", function (req, res) {
  res.render("paris");
});
app.get("/registration", function (req, res) {
  res.render("registration");
});
app.get("/rome", function (req, res) {
  res.render("rome");
});
app.get("/santorini", function (req, res) {
  res.render("santorini");
});
app.get("/searchresults", function (req, res) {
  res.render("searchresults");
});
app.get("/wanttogo", function (req, res) {
  res.render("wanttogo");
});

app.post("/", async function (req, res) {
  try {
    const user = req.body.username;
    const pass = req.body.password;

    const currentuser = await db
      .collection("users")
      .findOne({ username: user });

    if (currentuser.password == pass) {
      res.redirect("http://localhost:3000/home");
    } else {
      alert("Incorrect Password");
    }
  } catch (error) {
    alert(
      "Invalid username. Please create an account or enter an existing username"
    );
  }
});

app.post("/register", function (req, res) {
  var user = req.body.username;
  var pass = req.body.password;
  var data = {
    "username": user,
    "password": pass,
  };
  if (db.collection("users").findOne(user.username) != null) {
    alert("user already exists");
  } else {
    db.collection("users").insertOne(data, function (err) {
      if (err) {
        console.log(err);
      } else console.log("Record inserted Successfully");
    });
    alert("registration successful");
    res.redirect("http://localhost:3000/");
  }
});
//does not work yet
app.post("/search",function(req,res){
  const pages = JSON.parse("pages.json");
  console.log(pages);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
