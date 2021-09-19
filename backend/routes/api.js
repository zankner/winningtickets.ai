const express = require("express");
const multer = require("multer")
const upload = multer();
const api = require("../api");

const router = express.Router();

// Models
router.post("/models/create", upload.single("modelFile"), api.models.create)
router.get("/models/get", api.models.getAll)
router.get("/models/:modelId/get", api.models.get)

module.exports = router;
