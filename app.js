require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/usersDB");

const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

UserSchema.plugin(encrypt, {secret: process.env.MY_SECRET, encryptedFields: ["password"]});
const User = new mongoose.model("User", UserSchema);


app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/login", function(req, res){
  User.findOne({username: req.body.username}, function(err, foundUser){
    if(err) console.log(err);
    else if(foundUser.username===req.body.username){
       if(foundUser.password===req.body.password) res.render("secrets");
       else res.send("Please Enter correct Password.");
  } else res.send("Please Enter correct Email Id.");
  });

});

app.post("/register", function(req, res){
  User.findOne({username: req.body.username}, function(err, foundUser){
    if(err) console.log(err);
    else {
      const userName = new User({
        username: req.body.username,
        password: req.body.password
      });
      userName.save();
      res.render("secrets");
    };
  });

});

app.listen(3000, function(){
  console.log("Secrets app is running on port 3000");
});
