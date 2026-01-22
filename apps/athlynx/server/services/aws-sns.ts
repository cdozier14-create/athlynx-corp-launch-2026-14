/**
 * AWS SNS Service - SMS Verification
 * ATHLYNX AI Corporation
 * 
 * @author ATHLYNX AI Corporation
 * @date January 8, 2026
 */

import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const snsClient = new SNSClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

/**
 * Send SMS via AWS SNS
 */
export async function sendSMS(
  phone: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Format phone number (must include country code)
    const formattedPhone = phone.startsWith('+') ? phone : `+1${phone.replace(/\D/g, '')}`;
    
    const message = `Your ATHLYNX verification code is: ${code}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this, please ignore this message.`;
    
    const command = new PublishCommand({
      PhoneNumber: formattedPhone,
      Message: message,
      MessageAttributes: {
        'AWS.SNS.SMS.SMSType': {
          DataType: 'String',
          StringValue: 'Transactional', // Use Transactional for verification codes
        },
      },
    });
    
    await snsClient.send(command);
    
    console.log(`[AWS SNS] SMS sent to ${formattedPhone}`);
    return { success: true };
  } catch (error) {
    console.error('[AWS SNS Error]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send SMS',
    };
  }
}

export default { sendSMS };
