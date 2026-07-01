const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv/config");

const s3 = new S3Client({ region: "us-east-1" });
const BUCKET = process.env.BUCKET;
const PROJECT_ID = process.env.PROJECT_ID;
const PROJECT_NAME = process.env.PROJECT_NAME;

const YAML_FILE = `${PROJECT_ID}.yaml`;
const HTML_FILE = `${PROJECT_ID}.html`;

async function updateManifest() {
  let manifest = { updatedAt: new Date().toISOString(), designs: [] };

  try {
    const res = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: "manifest.json" }));
    const body = await res.Body.transformToString();
    manifest = JSON.parse(body);
  } catch (error) {
    console.log("Manifest no encontrado o no accesible, se creara uno nuevo...");
  }

  const designIndex = manifest.designs.findIndex((design) => design.id === PROJECT_ID);
  const newDesign = {
    id: PROJECT_ID,
    name: PROJECT_NAME,
    yaml: `https://${BUCKET}.s3.amazonaws.com/${YAML_FILE}`,
    html: `https://${BUCKET}.s3.amazonaws.com/${HTML_FILE}`,
    lastUpdated: new Date().toISOString(),
  };

  if (designIndex >= 0) {
    manifest.designs[designIndex] = newDesign;
  } else {
    manifest.designs.push(newDesign);
  }

  manifest.updatedAt = new Date().toISOString();

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: "manifest.json",
      Body: JSON.stringify(manifest, null, 2),
      ContentType: "application/json",
      ACL: "public-read",
    })
  );

  console.log("Manifest actualizado en S3");
}

updateManifest().catch((error) => {
  console.error("No se pudo actualizar el manifest:", error);
  process.exitCode = 1;
});
