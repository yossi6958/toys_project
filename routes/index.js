const express = require("express");
const router = express.Router();

router.get("/" , async (req,res) => {
    res.json({msg:"/product to see all products"})
})

module.exports = router;