//jshint esversion:6
require('dotenv').config();
const express=require('express');
const ejs=require('ejs');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const encrypt=require("mongoose-encryption");
const app=express();


app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser:true});

const userSchema=new mongoose.Schema({
    username:String,
    password:String
});

console.log(process.env.API_KEY);
userSchema.plugin(encrypt,{secret:process.env.SECRETS,encryptedFields:["password"]});

const User= new mongoose.model("users",userSchema,"users");

app.get("/",function (req,res) {
    res.render("home");
});

app.get("/login",function (req,res){
    res.render("login");
});


app.get("/register",function (req,res){
    res.render("register");
});

app.post("/register",function (req,res) {
    const newUser=new User({
        username:req.body.username,
        password:req.body.password
    });

    newUser.save().then(()=>{res.render("secrets")}).catch((err)=>{
        res.send(err);
    });

});

app.post("/login",function (req,res) {
    const username =req.body.username;
    const password =req.body.password;

    User.findOne({username:username}).then ((foundUser)=>{
        if (foundUser && foundUser.password===password){
            res.render("secrets");
        }
        else {
            // User not found or incorrect password
            res.send("Invalid username or password.");
        }
    }).catch ((err)=>{
        console.log((err));
    });

});






app.listen(3000,function(){
    console.log("Successfully connected on Port 3000");
})



