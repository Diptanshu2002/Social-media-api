const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const { verify } = require('../JWT/jwt')
// /api/posts

//create-a-post-------------------------------------------------------------
/*
  in request body we need :
      1. logged user - user id
      2. 
*/
router.post("/post",async (req, res) => {
  try {
    console.log(req.body)
    const post = await Post.create(req.body);
    res.status(200).json({
      status : "successful",
      // ...post._doc
    });
  } catch (err) {
    res.status(200).json({
      status : "error",
      message : "Could Not able to send the post"
    });
  }
});

//update-a-post-------------------------------------------------------------
/*
  need post id as params
  in body need the logged user - userid
*/
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      const updatedPost = await post.updateOne({ $set: req.body });
      res.status(200).json({
        status : "successful",
        ...updatedPost});
    } else {
      res.status(403).json({
        status : "error",
        message : "you can update your post only"});
    }
  } catch (error) {
    res.status(500).json({
      status : "error",
      message : "Internal Server Error"});
  }
});

//delete-a-post-------------------------------------------------------------
/*
  need post id as params
  in body need the logged user - userid
*/
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    console.log(req.body.userId)
    console.log(post.userId)
    if (req.body.userId == post.userId) {
      await post.deleteOne(); //----> will work perfectly
      //await post.deleteOne({ _id : req.params.id });
      res.status(200).json({
        status : "successfull",
        message : "post deleted successfully"
      });
    } else {
      res.status(400).json({
        status : "error",
        message : "You can delete your own post"
      });
    }
  } catch (error) {
    res.status(403).json(error);
  }
});

//like-dislike-a-post-------------------------------------------------------
/*
  in params need the id of the post which will be liked or disliked
  in body   need the id of the user who will liked or dislike the post
*/
router.put("/:id/likes", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("liked the post");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("unliked the post");
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "could not process your request",
    });
  }
});

//get-a-post----------------------------------------------------------------
/*
  need post id
*/
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const { createdAt, updatedAt, ...restElements } = post._doc;
    res.status(200).json(restElements);
  } catch (error) {
    res.status(400).json({
      status : "error",
      message : "could not find the post",
    });
  }
});

//get-timeline-posts--------------------------------------------------------
/*
  need userId in params of logged in user
*/
router.get("/timeline/:userId", async (req, res) => {
  try {
    //console.log("user from jwt" , req.user)
    const currentUser = await User.findById(req.params.userId);

    const userPosts = await Post.find({ userId: currentUser._id });
    
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json({
      status:"error",
      message: "Internal Server Error"
  });
  }
});

//get user's all posts
/*
  need the username of the user who posted the post.
*/
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    //returns a array
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({
      status : "error",
      message : "Internal server error"
    });
  }
});

router.get("/video/:id", async(req, res)=>{
  const userId = req.params.id;
  try {
    const user = await User.findById(userId)
    const userPost = await Post.find({
      userId,
      type : "video"
     })
     const friendPost = await Promise.all(
       user.followings.map(async(u)=>{
         console.log(u)
         return await Post.find({
          userId: u,
          type : "video" 
        })
       })
     )
     const mergePost = userPost.concat(...friendPost)
    //  console.log("videos->",mergePost)
     res.json(mergePost);
     return;
  } catch (error) {
    res.json(error); 
  }
})

module.exports = router;
