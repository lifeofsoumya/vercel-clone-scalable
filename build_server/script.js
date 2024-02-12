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

async function init() {
  const distDirComponents = fs.readdirSync(
    path.join(__dirname, "home", "app", "output", "dist"), // for docker do /output/dist but for now /home/app/output/dist
    { recursive: true }
  );

  console.log("distDirComponents", distDirComponents);

  for (const filePath of distDirComponents) {
    if (fs.lstatSync(filePath).isDirectory()) continue;

    console.log('Starting the uploading process for ', filePath)

    const command = new PutObjectCommand({
      Bucket: "ocode",
      Key: `__outputs/${project_id}/${filePath}`,
      Body: fs.createReadStream(filePath),
      ContentType: mime.lookup(filePath),
    });

    await s3Client.send(command);
  }

  console.log("Done uploading to S3");
}
init();
