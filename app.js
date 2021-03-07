//jshint esversion:6
const express=require("express");
const ejs=require("ejs");
const bodyparser=require("body-parser");
const mongo=require("mongoose");
const encryption=require("mongoose-encryption");

//connect to mongo db data base
mongo.connect("mongodb://localhost:27017/userDB");
//creating a schema for db
const userSchema=new mongo.Schema({
    name:String,
    email:String,
    password:String,
    phonno:Number
})
//creating a model 
const User= mongo.model("User",userSchema);
//array to store user data
let users=[];
msg="";

const app=express();
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"))



app.get("/",function(req,res){
    res.render("home");
})
app.get("/login",function(req,res){
    res.render("login",{msg:msg});
})
app.get("/register",function(req,res){
    res.render("register");
})

//when user register him/herself
app.post("/register",function(req,res){
        let user={
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            phonno:req.body.phonno,
        }
        users.push(user);
        User.insertMany(users,function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log("success");
                res.render("secrets");
            }
        })
   
})
//when user login 
app.post("/login",function(req,res){
    let email=req.body.email;
    let password=req.body.password;
    User.findOne({email:email},function(err,result){
        if(err){
            console.log(err);

        }
        else{
            if(result.password===password){
                console.log("success");
                res.render("secrets");
                msg="";
            }
            else{
                msg="Please Try Again incorrect password or username"
                res.redirect("login")
            }
        }
    })
})
//when user click logout
app.get("/logout",function(req,res){
    res.render("home")
})
app.listen(3000,function(){
    console.log("Server id started on port 3000 ");
})