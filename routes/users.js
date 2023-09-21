const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel, validateUser, createToken, validateLogin } = require("../models/userModel");
const { auth, adminAuth } = require("../middleware/auth");
const router = express.Router();

// get all the users
router.get("/", async (req, res) => {
    res.json({msg:"server is running"})
});

router.get("/userInfo" , auth , async (req, res) => {
    try{
        const data = await UserModel.findOne({_id:req.tokenData._id}, {password :0})
        res.json(data);
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})

// only an admin can see the user list
router.get("/userList" , adminAuth , async (req,res) => {
    try{
        const data = await UserModel.find({});
        res.json(data);
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})

// sign up
router.post("/", async (req, res) => {
  const validBody = validateUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const user = new UserModel(req.body);
    // crypt the user password
    user.password = await bcrypt.hash(user.password, 10);
    // save the password as * so the hacker couldnt know which crypt we using.
    await user.save();
    user.password = "*********";
    res.json(user);
  } catch (err) {
    // check if the email is already in the database.
    if (err.code == 11000) {
      return res
        .status(400)
        .json({ err: "Email already in system", code: 11000 });
    }
    console.log(err);
    res.status(502).json({ err });
  }
});

// check if the user already exists (signed up).
router.post("/login", async (req, res) => {
  try {
    const validBody = validateLogin(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ err: "Email not match" });
    }
    const password = await bcrypt.compare(req.body.password , user.password);
    if (!password) {
      return res.status(401).json({ err: "Password not match" });
    }
    const token = createToken(user._id , user.role)
    res.json({token})
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

//my Info

router.get("/myInfo", auth, async (req, res) => {
  try {
    const data = await UserModel.findOne(
      { _id: req.tokenData._id },
      { password: 0 }
    );
    console.log(req.tokenData);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

module.exports = router;
