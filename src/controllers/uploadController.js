const axios = require("axios");
const XLSX = require("xlsx");
const Student = require("../models/Student");

const uploadExcel = async (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);

    const sheetName = workbook.SheetNames[0];

    const data = XLSX.utils
      .sheet_to_json(workbook.Sheets[sheetName])
      .slice(0, 3);

    let imported = 0;
    let failed = 0;

    for (const student of data) {
      try {
        const prediction = await axios.post(
          "https://ai-model-prediction.onrender.com/predict",
          {
            level: student.level,
            age: student.age,
            cgpa: student.cgpa,
            attendance: student.attendance,
            carryovers: student.carryovers,
            fees_paid: student.fees_paid,
          },
        );

        await Student.create({
          matricNo: student.student_id,
          fullName: `Student ${student.student_id}`,

          faculty: student.faculty,
          department: student.department,

          gender: student.gender,
          level: student.level,
          age: student.age,

          cgpa: student.cgpa,
          attendance: student.attendance,
          carryovers: student.carryovers,

          feesPaid: student.fees_paid === 1,

          riskLevel: prediction.data.risk,
          probability: prediction.data.probability,
        });

        imported++;
      } catch (err) {
        failed++;

        console.log("FAILED STUDENT:");
        console.log(student);

        console.log("ERROR:");
        console.log(err.response?.data || err.message);
      }
    }

    res.json({
      message: "Excel import completed",
      totalRecords: data.length,
      imported,
      failed,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  uploadExcel,
};
