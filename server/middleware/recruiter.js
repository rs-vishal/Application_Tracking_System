const express = require("express");
const mongoose = require("mongoose");
const model = require("../models/job.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Application = require("../models/applications.js");
const Job = require("../models/job.js");
const Interview = require("../models/interview.js");
const router = express.Router();

router.post("/createJob/:id",async (req, res) => {
    const { title, description, company ,status,salary } = req.body;
    try {
        const postedBy = req.params.id; 
        const existingJob = await model.findOne({ title, postedBy });
        if (existingJob) {
            return res.status(400).json({ msg: "Job already exists" });
        }
        
        const job = new model({ title, description,company ,status, salary, postedBy });
        await job.save();
        res.status(201).json({ msg: "Job created successfully", job });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.get("/job/:id", async (req, res) => {
    try{
        const job = await model.findById(req.params.id);
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

router.put("/job/:id", async (req, res) => {
    try {
        const job = await model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!job) {
            return res.status(404).json({ msg: "Job not found" });
        }
        res.status(200).json({ msg: "Job updated successfully", job });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.delete("/job/:id", async (req, res) => {
    try {
        const job = await model.findByIdAndDelete(req.params.id);
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
        const applications = await Application.find();
        res.status(200).json(applications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.get("/application/:id", async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ msg: "Application not found" });
        }
        res.status(200).json(application);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.put("/application/:id/status", async (req, res) => {
    const { status } = req.body;
    try {
        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );
        if (!application) {
            return res.status(404).json({ msg: "Application not found" });
        }
        res.status(200).json({ msg: "Application status updated successfully", application });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.post("/schedule-interview", async (req, res) => {
    const { applicationId, date, time } = req.body;
    try {
        const interview = new Interview({ applicationId, date, time });
        await interview.save();
        res.status(201).json({ msg: "Interview scheduled successfully", interview });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
module.exports = router;