const express = require("express");
const  router = express.Router();
const mongoose = require("mongoose");
const {login,register} = require("../middleware/user");

router.post("/login", login);
router.post("/register", register);