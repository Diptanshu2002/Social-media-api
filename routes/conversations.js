const router = require('express').Router()
const Conversation = require('../models/Convsersation')

// /api/conversation

//-----CREATE-FROM------
router.post('/', async(req, res)=>{
    const conversation = new Conversation({
        members : [req.body.senderId, req.body.recieverId] 
    })
    try {
        const respond = await conversation.save();
        res.status(200).json(respond);
    } catch (error) {
        res.status(500).json(error)
    }
})

//-----GET CONVERSATION-ID-----
router.get('/:id', async(req,res)=>{
    userId = req.params.id;
    try {
        const conversation = await Conversation.find({
            members : { $in : [userId] }
        })
        res.status(200).json(conversation)
    }catch(error){
        res.status(500).json(error)
    }
})




module.exports = router;