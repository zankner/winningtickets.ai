const mongoose = require("mongoose");

const ModelSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  modelName: {
    type: String,
    required: true,
  },
  scale: {
    type: Number,
    required: true,
  },
  accuracy: {
    type: Number,
    required: true,
  },
  dataset: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("models", ModelSchema);
