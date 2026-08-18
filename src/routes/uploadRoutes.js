const express = require("express");
const multer = require("multer");

const {
  uploadExcel
} = require("../controllers/uploadController");

const router = express.Router();

const upload = multer({
  dest: "uploads/"
});

router.post(
  "/excel",
  upload.single("file"),
  uploadExcel
);

module.exports = router;