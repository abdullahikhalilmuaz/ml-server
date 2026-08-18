const Student = require("../models/Student");

const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();

    const highRisk = await Student.countDocuments({
      riskLevel: "HIGH",
    });

    const lowRisk = await Student.countDocuments({
      riskLevel: "LOW",
    });

    const maleStudents = await Student.countDocuments({
      gender: "M",
    });

    const femaleStudents = await Student.countDocuments({
      gender: "F",
    });

    res.json({
      totalStudents,
      highRisk,
      lowRisk,
      maleStudents,
      femaleStudents,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};