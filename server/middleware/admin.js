const express = require("express");
const mongoose = require("mongoose");
const model = require("../models/user.js");
const Job = require("../models/job.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Application = require("../models/applications.js");

const router = express.Router();


router.get("/users", async (req, res) => {
    try{
        const users = await model.find();
        res.status(200).json(users);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.post("/create_recruiter", async (req, res) => {
    let { username, email, password,role } = req.body;
    try {
        let user = await model.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }
        password = await bcrypt.hash(password, 10);
        user = new model({ username, email, password, role });
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
}
);

router.get("/jobs", async (req, res) => {
    try{
        const users = await model.find();
        res.status(200).json(users);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.get("/job/:id", async (req, res) => {
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


router.get("/user/:id", async (req, res) => {
    try{
        const user = await model.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.status(200).json(user);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
});    

router.put("/user/edit/:id", async (req, res) => {
    const { username, email, password ,role} = req.body;
    try {
        let user = await model.findByIdAndUpdate(req.params.id,{ username, email, password ,role}, {
            new: true,runValidators: true});
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.status(200).json({ msg: "User updated successfully", user });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


router.delete("/user/:id", async (req, res) => {
    try {
        const user = await model.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.status(200).json({ msg: "User deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.delete("/job/:id", async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) {
            return res.status(404).json({ msg: "Job not found" });
        }
        res.status(200).json({ msg: "Job deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.get("/applications", async (req, res) => {
  try {
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
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


module.exports = router;