const Student = require("../models/Student");

const getHighRiskReport = async (req, res) => {
  try {
    const totalHighRisk = await Student.countDocuments({
      riskLevel: "HIGH",
    });

    const maleHighRisk = await Student.countDocuments({
      riskLevel: "HIGH",
      gender: "M",
    });

    const femaleHighRisk = await Student.countDocuments({
      riskLevel: "HIGH",
      gender: "F",
    });

    const highRiskStudents = await Student.find({
      riskLevel: "HIGH",
    })
      .sort({ probability: -1 })
      .limit(10);

    res.json({
      totalHighRisk,
      maleHighRisk,
      femaleHighRisk,
      topHighRiskStudents: highRiskStudents,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getDepartmentAnalysis = async (req, res) => {
  try {
    const departments = await Student.aggregate([
      {
        $group: {
          _id: "$department",

          totalStudents: {
            $sum: 1,
          },

          highRiskStudents: {
            $sum: {
              $cond: [
                { $eq: ["$riskLevel", "HIGH"] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $addFields: {
          highRiskPercentage: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [
                      "$highRiskStudents",
                      "$totalStudents",
                    ],
                  },
                  100,
                ],
              },
              2,
            ],
          },
        },
      },
      {
        $sort: {
          highRiskStudents: -1,
        },
      },
    ]);

    res.json(departments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getRiskSummary = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();

    const highRisk = await Student.countDocuments({
      riskLevel: "HIGH",
    });

    const lowRisk = await Student.countDocuments({
      riskLevel: "LOW",
    });

    const percentageHighRisk = Number(
      ((highRisk / totalStudents) * 100).toFixed(2)
    );

    const percentageLowRisk = Number(
      ((lowRisk / totalStudents) * 100).toFixed(2)
    );

    res.json({
      totalStudents,
      highRisk,
      lowRisk,
      percentageHighRisk,
      percentageLowRisk,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getHighRiskReport,
  getDepartmentAnalysis,
  getRiskSummary,
};
