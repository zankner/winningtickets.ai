const status = require("http-status");
const Model = require("../../models/model");

module.exports = async (req, res) => {
  try {
    const models = await Model.find({});

    return res.send(models);
  } catch (err) {
    console.log(err.message);
    return res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
};
