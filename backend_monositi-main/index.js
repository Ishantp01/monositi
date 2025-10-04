const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

dotenv.config();

// Initialize app
const app = express();
const corsOptions = {
  origin: "http://localhost:5173", // frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Middlewares
app.use(express.json());

app.use(morgan("dev"));
// If you want JSON endpoints too
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const mainRoutes = require("./routes/index");

app.use("/api", mainRoutes);



// db connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT || 5000, () => console.log(`Server running`));
  })
  .catch((err) => console.log(err));
