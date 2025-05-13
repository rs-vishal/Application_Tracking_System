const express = require("express");
const mongoose = require("mongoose");
const Model = require("../models/user.js");
const Application = require("../models/applications.js");
const Job = require("../models/job.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", async (req, res) => {
  let { username, email, password } = req.body;
  try {
    let user = await Model.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    password = await bcrypt.hash(password, 10);
    user = new Model({ username, email, password });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return res.status(201).json({
      msg: "User registered successfully",
      token,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await Model.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(200).json({
      msg: "User logged in successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get('/application/:userId',async (req,res) => {
    const userId = req.params.userId;
    try{
        const application = await Application.find({userId});
        if(!application){
            return res.status(404).json({msg:"No application found"});
        }
        res.status(200).json({msg:"Application found",application});
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.get('/applications',async (req,res) => {
    try{
        const applications = await Application.find()
        .populate({
        path: "userId",
        select: "username email role",
      })
      .populate({
        path: "jobId",
        select: "title description company salary status",
      });
        res.status(200).json(applications);
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.post('/apply/:jobId',async (req,res)=>{
    const jobId = req.params.jobId;
    
    const userId = req.body.userId;
    
    try{
        const application = new Application({jobId,userId});
        await application.save();
        res.status(201).json({msg:"Application created successfully",application});
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.delete('/application/:id',async (req,res)=>{
    const applicationId = req.params.id;
    try{
        const application = await Application.findByIdAndDelete(applicationId);
        if(!application){
            return res.status(404).json({msg:"Application not found"});
        }
        res.status(200).json({msg:"Application deleted successfully"});
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.get('/job', async (req, res) => {
    try{
        const jobs = await Job.find();
        if (!jobs) {
            return res.status(404).json({ msg: "No jobs found" });
        }
        res.status(200).json(jobs);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
}
);    

router.get('/job/:id', async (req, res) => {
    try{
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ msg: "Job not found" });
        }
        res.status(200).json(job);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.put('/edit_profile/:id',async (req,res)=>{
  const userId = req.params.id;
  const {username,email,skills} = req.body;
  try{
    const user = await Model.findByIdAndUpdate(userId,{username,email,skills},{new:true});
    if(!user){
        return res.status(404).json({msg:"User not found"});
    }
    res.status(200).json({msg:"User updated successfully",user});
  }
  catch(err){
    console.error(err.message);
    res.status(500).send("Server error");
  }
})

module.exports = router;
