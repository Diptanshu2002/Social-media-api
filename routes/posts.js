const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// /api/posts

//create a post

router.post('/' , async (req,res)=>{
    try{
        const post = await Post.create(req.body);
        res.status(200).json(post);
    }catch(err){
        res.status(200).json(err);
    }
})

//update a post

router.put('/:id', async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            const updatedPost = await post.updateOne({$set : req.body});
            res.status(200).json(updatedPost);
        }else{
            res.status(403).json("you can update your post only");
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

//delete a post

router.delete('/:id' ,  async (req , res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(req.body.userId === post.userId){
            // await post.deleteOne(); ----> will work perfectly
           await post.deleteOne({userId : req.body.userId});
           res.status(200).json('post deleted');
        }else{
            res.status(403).json("you can delete your post only")
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

//like a post
//get a post
//get timeline posts


module.exports = router;