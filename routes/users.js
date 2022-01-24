const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require('../models/User');
const { Router } = require("express");

// /api/users/

router.get("/", (req ,res)=>{
    res.send("users")
})
//update user
router.put('/:id' , async(req , res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        //if password reset request came then encrypt the new password with bcrypt
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password , salt)
            }catch(err){
                res.status(500).json(err);
            }
        }
        // updating user details to the database
        try {
            const user = await User.findByIdAndUpdate(req.params.id , {$set : req.body});
            console.log(user);
            res.status(200).json("account updated");
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json({error : "user data update failed"})
    }
})
//delete user 
router.delete('/:id' , async(req , res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        
        // deleting user from the database
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("account deleted");
        } catch (error) {
            res.status(500).json("err")
        }
    }else{
        res.status(403).json({error : "user data deletion failed"})
    }
})
//get a user
router.get('/:id' , async(req , res)=>{

        try{
            const user = await User.findById(req.params.id);
            const {password , updatedAt , ...other} = user._doc;
            res.status(200).json(other);
    
        }catch(error){
            res.status(500).json("err")
        }
})
//follow a user
//unfollow a user

module.exports = router;