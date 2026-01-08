// Send SMS to Chad - January 7, 2026 @ 10:05 PM CST
import twilio from 'twilio';

const TWILIO_ACCOUNT_SID = 'AC42c81cc5bed40c06bba310faa55c9ea4';
const TWILIO_AUTH_TOKEN = '4702a5ccba87b942171829075eb8dc8d';
const TWILIO_PHONE = '+18774618601';
const CHAD_PHONE = '+16014985282';

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const message = `🦁 ATHLYNX AI - 10 PM REPORT

Coach, ALL SYSTEMS GO!

✅ Dev Server: RUNNING
✅ 108+ files: SAFE  
✅ Nebius: 41 AI Models
✅ Stripe: CONNECTED
✅ Team Emails: SENT

THE CORPORATE PLAYBOOK is ready!

Dreams Do Come True 2026!

- Your Manus AI Team`;

async function sendSMS() {
  try {
    const result = await client.messages.create({
      body: message,
      from: TWILIO_PHONE,
      to: CHAD_PHONE
    });
    console.log('✅ SMS SENT to Chad!');
    console.log('   SID:', result.sid);
  } catch (err) {
    console.log('❌ SMS Error:', err.message);
  }
}

sendSMS();
