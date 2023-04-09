
const express=require('express');
const mongoose=require('mongoose');
const router=express.Router();
const user=mongoose.model("user")

const checkloggedin=require("../middleware/checkloggedin")



router.get("/user/:id",checkloggedin, function(req,res){
  console.log("inside user")
  user.findOne({_id:req.params.id})
  .select({password:0})
  .exec(function(error,founduser){
  if(error){
    return res.status(404).json({err:"user not found"});
  }
      res.json({founduser})
    })
  
  })

  router.put("/updatePersonalDetails",checkloggedin,function(req,res){
    console.log("inside follow method ",req.body)
    const {fname,lname,phone} =req.body;
    user.findByIdAndUpdate(req.user._id,{
      lname,
      fname,
      phone
    },{new:true}).exec(function(err,result){
      if(err){
        return res.status(422).json({error:err});
      }
      console.log("result:",result)
      res.status(200).json({result});
    }
    )
  
  })

  router.post("/addInterest",checkloggedin,function(req,res){
    console.log("inside addInterest method ",req.body.interest)
    user.findByIdAndUpdate(req.user._id,{
      $addToSet: ({interests:req.body.interest})
    },{new:true}).exec(function(err,result){
      if(err){
        return res.status(422).json({error:err});
      }
     
      console.log("addInterest:",result)
        res.status(200).json({result});
    })
  
  })

  router.post("/removeInterest",checkloggedin,function(req,res){
    console.log("inside addInterest method ",req.body.interest)
    user.findByIdAndUpdate(req.user._id,{
      $pull: ({interests:req.body.interest})
    },{new:true}).exec(function(err,result){
      if(err){
        return res.status(422).json({error:err});
      }
     
      console.log("addInterest:",result)
        res.status(200).json({result});
    })
  
  })



  router.get("/getFollowers",checkloggedin,function(req,res){
    console.log("inside getFollowers",)
    user.find({_id:{ $in: req.user.followers }}).exec(function(err,foundFollowers){
      if(err){
        return res.status(422).json({error:err});
      }
     
      console.log("inside getFollowers result:",foundFollowers)
      res.status(200).json({foundFollowers});
    }
    )
  
  })





  router.put("/follow",checkloggedin,function(req,res){
    console.log("inside follow method ",req.body.followId)
    user.findByIdAndUpdate(req.body.followId,{
      $addToSet: ({followers:req.user._id})
    },{new:true}).exec(function(err,result){
      if(err){
        return res.status(422).json({error:err});
      }
     
      console.log("inside follow method result:",result)
      user.findByIdAndUpdate(req.user._id,{
        $addToSet: ({following:req.body.followId})
      },{new:true})
      .exec(function(err,result){
  
        if(err){
          return res.status(422).json({error:err});
        }
        res.status(200).json({result});
       
      })
    }
    )
  
  })



router.put("/follow",checkloggedin,function(req,res){
  console.log("inside follow method ",req.body.followId)
  user.findByIdAndUpdate(req.body.followId,{
    $addToSet: ({followers:req.user._id})
  },{new:true}).exec(function(err,result){
    if(err){
      return res.status(422).json({error:err});
    }
   
    console.log("inside follow method result:",result)
    user.findByIdAndUpdate(req.user._id,{
      $addToSet: ({following:req.body.followId})
    },{new:true})
    .exec(function(err,result){

      if(err){
        return res.status(422).json({error:err});
      }
      res.status(200).json({result});
     
    })
  }
  )

})

router.put("/unfollow",checkloggedin,function(req,res){
  console.log("inside follow method ",req.body.followId)
  user.findByIdAndUpdate(req.body.followId,{
    $pull: ({followers:req.user._id})
  },{new:true}).exec(function(err,result){
    if(err){
      return res.status(422).json({error:err});
    }
   
    console.log("inside follow method result:",result)
    user.findByIdAndUpdate(req.user._id,{
      $pull: ({following:req.body.followId})
    },{new:true})
    .exec(function(err,result){

      if(err){
        return res.status(422).json({error:err});
      }
      res.status(200).json({result});
     
    })
  }
  )



})




router.put("/updatepic",checkloggedin,function(req,res){

  user.findByIdAndUpdate({_id:req.user._id} ,{$set:{pic:req.body.pic}},{new:true},function(err,result){
    if(err){
      return res.status(422).json({error:"profile picture is not updated"})
    }
    res.json({result});
  })
})




module.exports=router;