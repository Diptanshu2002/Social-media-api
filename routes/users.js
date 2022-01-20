const express = require("express");
const router = express.Router();

// /api/users/

router.get("/", (req ,res)=>{
    res.send("users")
})



module.exports = router;