import { SESClient, ListVerifiedEmailAddressesCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

try {
  const command = new ListVerifiedEmailAddressesCommand({});
  const response = await sesClient.send(command);
  console.log("✅ AWS SES Connected!");
  console.log("Verified emails:", response.VerifiedEmailAddresses);
  
  if (response.VerifiedEmailAddresses?.includes("noreply@athlynx.ai")) {
    console.log("✅ noreply@athlynx.ai IS VERIFIED!");
  } else {
    console.log("❌ noreply@athlynx.ai NOT VERIFIED");
  }
} catch (error) {
  console.error("❌ AWS SES Error:", error.message);
}
