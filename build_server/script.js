const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const mime = require("mime-types");
require("dotenv").config();

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const project_id = process.env.PROJECT_ID || 'demo-project'

async function init() {
  const distDirPath = path.join(__dirname, "output", "dist"); // for docker do /output/dist but for now /home/app/output/dist
  const distDirComponents = fs.readdirSync(
    distDirPath,
    { recursive: true }
  );

  console.log("distDirComponents", distDirComponents);

  for (const file of distDirComponents) {
    const filePath = path.join(distDirPath, file)
    if (fs.lstatSync(filePath).isDirectory()) continue;

    console.log('Starting the uploading process for ', filePath, " And file is ", file)

    const command = new PutObjectCommand({
      Bucket: "ocode",
      Key: `__outputs/${project_id}/${file}`,
      Body: fs.createReadStream(filePath),
      ContentType: mime.lookup(filePath),
    });

    await s3Client.send(command);
  }

  console.log("Done uploading to S3");
}
init();
