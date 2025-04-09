const AWS = require("aws-sdk");
const fs = require("fs");

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

exports.uploadToS3 = (file) => {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `${Date.now()}-${file.originalname}`,
      Body: file.buffer, // ✅ use in-memory buffer
      ContentType: file.mimetype,
    };
  
    return s3.upload(params).promise();
  };

exports.deleteFromS3 = (s3Url) => {
    const AWS = require("aws-sdk");
  
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  
    const bucketName = process.env.AWS_S3_BUCKET;
  
    const key = s3Url.split(`https://${bucketName}.s3.amazonaws.com/`)[1];
  
    const params = {
      Bucket: bucketName,
      Key: key,
    };
  
    return s3.deleteObject(params).promise();
  };
  