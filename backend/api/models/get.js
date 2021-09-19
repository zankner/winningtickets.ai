const status = require("http-status");

const IBM = require('ibm-cos-sdk');
const config = {
  endpoint: process.env.IBM_AUTH_ENDPOINT,
  apiKeyId: process.env.IBM_API_KEY,
  serviceInstanceId: process.env.IBM_SERVICE_ID,
  signatureVersion: 'iam',
};
const cos = new IBM.S3(config);

const getItem = (bucketName, itemName) => {
  console.log(`Retrieving item from bucket: ${bucketName}, key: ${itemName}`);
  return cos.getObject({
      Bucket: bucketName, 
      Key: itemName
  }).promise()
}


module.exports = async (req, res) => {
  try {
    const {modelId} = req.params;

    const model = await getItem("winning-tickets", modelId)
    res.send(model.Body)
  } catch (err) {
    console.log(err.message);
    return res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
};
