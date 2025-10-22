import AWS from "aws-sdk";

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// Upload file content
export const uploadFileToS3 = async (key, content) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: content,
        ContentType: "text/plain",
        ServerSideEncryption: "AES256",
    };
    await s3.putObject(params).promise();
    return key;
};

// Fetch file content
export const getFileFromS3 = async (key) => {
    const params = { Bucket: process.env.AWS_BUCKET_NAME, Key: key };
    const data = await s3.getObject(params).promise();
    return data.Body.toString("utf-8");
};
