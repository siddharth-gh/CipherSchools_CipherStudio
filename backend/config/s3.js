// config/s3.js
import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

// Initialize the AWS S3 client
const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
});

export default s3;
