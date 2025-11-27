const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = require("./config/db");
const redis = require("./config/redis");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Unable to start server", err);
    process.exit(1);
  }
};

start();
