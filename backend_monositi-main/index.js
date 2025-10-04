require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routers/user.routes");
const propertyRoutes = require("./routers/property.routes")

const app = express();
app.use(express.json());

// routes
app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes)

// db connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT || 5000, () => console.log(`Server running`));
  })
  .catch((err) => console.log(err));
