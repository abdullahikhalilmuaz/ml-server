const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    matricNo: {
      type: String,
      required: true,
      unique: true
    },

    fullName: {
      type: String,
      required: true
    },

    faculty: String,

    department: String,

    level: Number,

    gender: String,

    age: Number,

    cgpa: Number,

    attendance: Number,

    carryovers: Number,

    feesPaid: Boolean,

    riskLevel: String,

    probability: Number
  },
  {
    timestamps: true
  }
);


module.exports = mongoose.model(
  "Student",
  studentSchema
);