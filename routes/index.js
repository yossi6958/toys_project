const express = require("express");
const router = express.Router();

router.get("/" , async (req,res) => {
    res.json({msg:"/toys to see all toys"})
})

module.exports = router;