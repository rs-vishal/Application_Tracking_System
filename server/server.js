const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./middleware/user.js"); 
const adminRoutes = require("./middleware/admin.js");
const recruiterRoutes = require("./middleware/recruiter.js");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");


const app = express();

app.use(express.json());
app.use(cors())
mongoose.connect(process.env.MONGO_URI, {
   useNewUrlParser: true,
    useUnifiedTopology: true
    
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/recruiter", recruiterRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
