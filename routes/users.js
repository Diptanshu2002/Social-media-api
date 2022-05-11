const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require('../models/User');

const { verify } = require('../JWT/jwt')

// /api/users/

// router.get("/", (req ,res)=>{
//     res.send("users")
// })

//update user-----------------------------------------------------------------------------------------------------------------
router.put('/:id',async(req , res)=>{
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
            res.status(200).json("account updated");
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json({error : "user data update failed"})
    }
})

//delete user---------------------------------------------------------------------------------------------------------------- 
router.delete('/:id', async(req , res)=>{
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

//get a user------------------------------------------------------------------------------------------------------------------
router.get('/',async(req , res)=>{

        const userId = req.query.userId;
        const username = req.query.username;
        try{
            const user = userId ? await User.findById(userId) : await User.findOne({username : username})
            const {password , updatedAt , ...other} = user._doc;
            res.status(200).json(other);
    
        }catch(error){
            res.status(500).json("err")
        }
})

//follow a user---------------------------------------------------------------------------------------------------------------
router.put("/:id/follow",async (req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(currentUser.id)){
                await user.updateOne({$push : {followers : currentUser.id}});
                await currentUser.updateOne({$push : {followings : user.id}});
                res.status(200).json({
                    status:200,
                    message:"Followed "+ user.email
                });
            }else{
                res.status(403).json("you already follow")
            }

        }catch(error){
            res.status(500).json(error);
        }
    }else{
        res.status(403).json("You cant follow yourself");
    }
})

//unfollow a user---------------------------------------------------------------------------------------------------------------
router.put("/:id/unfollow", async (req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(currentUser.id)){
                await user.updateOne({$pull : {followers : currentUser.id}});
                await currentUser.updateOne({$pull : {followings : user.id}});
                res.status(200).json("user has been unfollowed");
            }else{
                res.status(403).json("you donot follow the user")
            }

        }catch(error){
            res.status(500).json(error);
        }
    }else{
        res.status(403).json("You cant unfollow yourself");
    }
})

//search route ------
router.get('/search', async(req, res)=>{
    const query = req.query.q;
    console.log(query);
    try {
        const queryResponse = await User.fuzzySearch();
        // const queryResponse = await User.find({$username : {$search: `${query}`}})
        // const queryResponse = await User.find({username : {$regex: /ribhu/}})
        
        res.json(queryResponse);
    } catch (error) {
        res.status(404).json(error)   
    }
})


// getting all friends details----
router.get('/friends/:id', async(req,res)=>{

    try {
        
        const user = await User.findById(req.params.id);

        const friends = await Promise.all(
        user.followings.map(async(friend)=>{
            friend = await User.findById(friend);
            const {createdAt, updatedAt, password, refreshToken, ...restElements } = friend._doc
            return restElements;    
        })
        )
        res.status(200).json(friends)

    } catch (error) {
        console.log('/friends error', error)
    }
    
})


module.exports = router;