const axios = require("axios");
const Student = require("../models/Student");

// Add student
const createStudent = async (req, res) => {
  try {
    const studentData = req.body;
    console.log(studentData);

    // Send data to AI model
    const prediction = await axios.post("https://ai-model-prediction.onrender.com/predict", {
      level: studentData.level,
      age: studentData.age,
      cgpa: studentData.cgpa,
      attendance: studentData.attendance,
      carryovers: studentData.carryovers,
      fees_paid: studentData.feesPaid ? 1 : 0,
    });
    // Add AI result
    studentData.riskLevel = prediction.data.risk;
    studentData.probability = prediction.data.probability;

    console.log("After AI Call");
    console.log(prediction.data);

    // Save to MongoDB
    const student = await Student.create(studentData);

    res.status(201).json(student);
  } catch (error) {
    console.log("ERROR:");
    console.log(error.response?.data);
    console.log(error.message);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Get all students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find();

    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get one student
const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    res.json(student);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update student
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(student);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);

    res.json({
      message: "Student deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getStudentCount = async (req, res) => {
  const count = await Student.countDocuments();

  res.json({
    totalStudents: count,
  });
};

module.exports = {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  getStudentCount
};
