const router = require('express').Router()
const Message = require("../models/Message")

router.post("/",async(req,res)=>{
    const newMessage = new Message(req.body)
    console.log(req.body)
    try {
        const sentMessage = await newMessage.save();
        res.status(200).json(sentMessage)
    } catch (error) {
        res.status(500).json(error)
    }
})






module.exports = router