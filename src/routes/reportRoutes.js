const express = require("express");

const {
  getHighRiskReport,
  getDepartmentAnalysis,
  getRiskSummary,
} = require("../controllers/reportController");

const router = express.Router();

router.get("/high-risk", getHighRiskReport);
router.get("/department-analysis", getDepartmentAnalysis);
router.get("/risk-summary", getRiskSummary);

module.exports = router;
