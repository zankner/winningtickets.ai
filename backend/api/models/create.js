const status = require("http-status");
const { v4: uuidv4 } = require('uuid');

const IBM = require('ibm-cos-sdk');
const config = {
  endpoint: process.env.IBM_AUTH_ENDPOINT,
  apiKeyId: process.env.IBM_API_KEY,
  serviceInstanceId: process.env.IBM_SERVICE_ID,
  signatureVersion: 'iam',
};
const cos = new IBM.S3(config);

const Model = require("../../models/model")

const uploadFile = (bucketName, itemName, fileText) => {
  return cos.putObject({
      Bucket: bucketName, 
      Key: itemName, 
      Body: fileText
  }).promise()
  .then(() => {
      console.log(`Item: ${itemName} created!`);
  })
  .catch((e) => {
      console.error(`ERROR: ${e.code} - ${e.message}\n`);
  });
}

module.exports = async (req, res) => {
  try {
    const {username, modelName, scale, accuracy, dataset} = req.body;
    const fileName = `${uuidv4()}.pt`;

    await uploadFile("winning-tickets", fileName, req.file.buffer)

    const model = new Model({username, modelName, scale, accuracy, dataset, fileName});
    await model.save()
    
    return res.sendStatus(status.OK);
  } catch (err) {
    console.log(err);
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .send({ message: err.message });
  }
}