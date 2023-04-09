const express=require("express");
const mongoose =require("mongoose");
const router=express.Router();

require("../models/model")
const user=mongoose.model("user");

//env to access keys
require('dotenv').config()
const checkloggedin=require("../middleware/checkloggedin.js")

const bcrypt=require("bcrypt");
const saltRounds = 12;
const jwt=require("jsonwebtoken");


router.get("/protected",checkloggedin,function (req,res){

    res.json({message:"success"});
})




router.post("/signup",function(req,res){

    console.log("inside signup");

    const {fname,lname,phone,email,password} =req.body;
    if(!fname || !phone || !email || !password){ return res.status(422).json({error:"Please fill all details"})
    }
//  ,{phone: phone}
    user.findOne({$or: [{email: email}]}).then((foundUser) => {

        if(foundUser){
            return res.status(422).json({error:"user already exists with same username or email"})
        }

        bcrypt.hash(password,saltRounds).then((hashedPassword,err) =>{
            if(!err){
                const newuser= new user({
                    fname,
                    lname,
                    phone,
                    email,
                    password:hashedPassword
                })
                newuser.save()
                    .then(user =>(res.json({message:"saved succesfully"})))
                    .catch(err => {console.log(err)})
            }

        })
    })
})

router.post("/signin",function(req,res){
    const {email,password} =req.body;
    if( !email || !password){res.status(422).json({error:"Please fill all details"})
    }

    user.findOne({email: email}).then((foundUser) => {

        if(foundUser){
            bcrypt.compare(password, foundUser.password, function(err, result) {
                // result == true
                if(result){

                    const token=jwt.sign({_id:foundUser._id},process.env.JWT_SECRET)

                    const{_id,fname,lname,pic,phone,email,followers,following}=foundUser;
                    res.json({token,user:{_id,fname,lname,pic,phone,email,followers,following}})
                    console.log("signed in");
                    // res.json({message:"Signin success"})
                }
                else{
                    res.status(422).json({error:"Invalid password"})
                }
            })
        }
        else{
            return res.status(422).json({error:"Invalid email"})
        }
    })

})

router.post("/updatePassword",checkloggedin,function(req,res){

    console.log("inside updatePassword");

    const {password,newpassword} =req.body;
    if( !newpassword || !password){
        res.status(422).json({error:"Please fill all details"})
        }
user.findOne({_id: req.user._id}).then((foundUser) => {

    if(foundUser){
        bcrypt.compare(password, foundUser.password, function(err, result) {
            // result == true
            if(result){

                bcrypt.hash(newpassword,saltRounds).then((hashedPassword,err) =>{
                    if(!err){
                        user.findByIdAndUpdate(req.user._id,{
                            password:hashedPassword
                          },{new:true})
                          .exec(function(err,result){
                            if(err){
                              return res.status(422).json({error:err});
                            }
                            console.log("result:",result)
                            console.log("password updated successfully");
                            // res.json({message:"password updated successfully"})
                            res.status(200).json({result});
                          })
                        
                    }
        

               
                })

                
                // res.json({token,user:{_id,fname,lname,pic,phone,email,followers,following}})
                
            }
            else{
                res.status(422).json({error:"Invalid password"})
            }
        })
    }
    else{
        return res.status(422).json({error:"user not found"})
    }
})

 

})

module.exports=router;