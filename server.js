const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./src/config/db");
const studentRoutes = require("./src/routes/studentRoutes");
const uploadRoutes = require("./src/routes/uploadRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const reportRoutes = require("./src/routes/reportRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://predictive-model-student-dropout-ri-one.vercel.app",
    ],
  }),
);

app.use("/api/students", studentRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Student Dropout Backend Running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
