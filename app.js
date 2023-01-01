let alert = require("alert");
var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var path = require("path");
const session = require("express-session");
var app = express();

var MongoClient = require("mongodb").MongoClient;
var db;
var error;
var waiting = [];
MongoClient.connect("mongodb://127.0.0.1:27017", function (err, client) {
  error = err;
  db = client.db("myDB");

  waiting.forEach(function (callback) {
    callback(err, client);
  });
});
module.exports = function (callBack) {
  if (db || error) {
    callback(error, db);
  } else {
    waiting.push(callBack);
  }
};

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  session({
    secret: "secret-word",
    resave: false,
    saveUninitialized: false,
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
      .collection("myCollection")
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
    username: user,
    password: pass,
    want_to_go: [],
  };
  if (db.collection("myCollection").findOne(user.username) == null) {
    alert("user already exists");
  } else {
    db.collection("myCollection").insertOne(data, function (err) {
      if (err) {
        console.log(err);
      } else console.log("Record inserted Successfully");
    });
    alert("registration successful");
    res.redirect("http://localhost:3000/");
  }
});

app.get("/search", function (req, res) {
  res.render("searchresults", { ourlist: [], added: "" });
});
const des = JSON.parse(fs.readFileSync("destinations.json"));

app.post("/search", function (req, res) {
  var sear = req.body.Search.toLowerCase();
  var result = [];
  var f = false;
  des.forEach((element) => {
    console.log(des);
    console.log(element.name);
    console.log(typeof element.name);
    console.log(sear);
    console.log(typeof term);
    console.log(element.name.includes(sear));
    if (element.name.toLowerCase.includes(sear)) {
      var obj = { name: element.name, val: element.link };
      result.push(obj);
      f = true;
    }
  });
  if (f) {
    res.render("searchresults", { ourlist: result, added: "" });
  } else {
    res.render("searchresults", {
      ourlist: [],
      added: "Destination not Found",
    });
  }
});

app.post("/annapurna")
app.post("/bali")
app.post("/inca")
app.post("/paris")
app.post("/rome")
app.post("/santorini")

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
