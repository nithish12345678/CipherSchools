const mongoose =require("mongoose");


const userSchema=new mongoose.Schema({
 fname:{
    type:String,
    required:true
 },
 lname:{
   type:String,
   required:true
},
 email:{
    type:String,
    required:true
 },
 phone:{
   type:String,
   required:true
},
 password:{
    type:String,
    required:true
 },
 pic:{
   type:String,
},
interests:[{
   type:String
}],
 followers:[{
   type:mongoose.Schema.ObjectId,
   ref:"user"
}],
following:[{
   type:mongoose.Schema.ObjectId,
   ref:"user"
}]

});


mongoose.model("user",userSchema);