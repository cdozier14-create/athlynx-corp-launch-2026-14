// ATHLYNX TEAM BLAST - DARK SPORTS THEME - January 7, 2026
import { Resend } from 'resend';
import twilio from 'twilio';

const resend = new Resend('re_ZQpN7oSa_e956Bzd312Bk881wDNJ1CB91');
const twilioClient = twilio('AC42c81cc5bed40c06bba310faa55c9ea4', '4702a5ccba87b942171829075eb8dc8d');
const TWILIO_PHONE = '+18774618601';

// VERIFIED TEAM - Current emails until @athlynx.ai is set up
const team = [
  { name: 'Chad A. Dozier', email: 'cdozier14@dozierholdingsgroup.com.mx', phone: '+16014985282' },
  { name: 'Glenn Tse', email: 'gtse@dozierholdingsgroup.com', phone: null },
  { name: 'Jimmy Boyd', email: 'jboydbamabayou@yahoo.com', phone: null },
  { name: 'Andrew Kustes', email: 'akustes@dozierholdingsgroup.com', phone: null },
  { name: 'Lee Marshall', email: 'leronius@gmail.com', phone: null },
  { name: 'David Ford', email: 'david.ford@aocmedicalllc.com', phone: null }
];

const subject = 'ATHLYNX AI - THE CORPORATE PLAYBOOK - WE ARE LIVE';

// DARK SPORTS THEME - NFL PLAYBOOK STYLE
const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background:#000;">
<div style="font-family: 'Arial Black', Arial, sans-serif; max-width: 650px; margin: 0 auto; background: linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 50%, #0d1b2a 100%); color: #fff; border: 3px solid #00d4ff;">

  <!-- HEADER BAR -->
  <div style="background: linear-gradient(90deg, #002244 0%, #003366 100%); padding: 15px; text-align: center; border-bottom: 4px solid #ffd700;">
    <span style="color: #ffd700; font-size: 12px; letter-spacing: 3px;">CONFIDENTIAL - FOUNDING TEAM ONLY</span>
  </div>

  <!-- MAIN HEADER -->
  <div style="text-align: center; padding: 30px 20px; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><text y=\".9em\" font-size=\"90\" opacity=\"0.03\">🏈</text></svg>') center center no-repeat; background-size: 200px;">
    <h1 style="color: #00d4ff; margin: 0; font-size: 36px; text-transform: uppercase; letter-spacing: 2px; text-shadow: 0 0 20px rgba(0,212,255,0.5);">ATHLYNX AI</h1>
    <h2 style="color: #ffd700; margin: 10px 0 0 0; font-size: 20px; font-weight: bold;">THE CORPORATE PLAYBOOK</h2>
    <p style="color: #888; margin: 10px 0 0 0; font-size: 14px;">January 7, 2026 | 10:15 PM CST</p>
  </div>

  <!-- STATUS BOX -->
  <div style="margin: 0 20px; background: rgba(0,255,136,0.1); border: 2px solid #00ff88; border-radius: 0; padding: 20px;">
    <h3 style="color: #00ff88; margin: 0 0 15px 0; font-size: 18px; text-transform: uppercase;">ALL SYSTEMS OPERATIONAL</h3>
    <table style="width: 100%; color: #fff; font-size: 14px;">
      <tr><td style="padding: 5px 0;">Dev Server</td><td style="text-align: right; color: #00ff88; font-weight: bold;">RUNNING</td></tr>
      <tr><td style="padding: 5px 0;">Platform Files</td><td style="text-align: right; color: #00ff88; font-weight: bold;">108+ SECURED</td></tr>
      <tr><td style="padding: 5px 0;">Nebius AI</td><td style="text-align: right; color: #00ff88; font-weight: bold;">41 MODELS READY</td></tr>
      <tr><td style="padding: 5px 0;">Stripe Payments</td><td style="text-align: right; color: #00ff88; font-weight: bold;">CONNECTED</td></tr>
      <tr><td style="padding: 5px 0;">Checkpoint</td><td style="text-align: right; color: #888;">fbde21f8</td></tr>
    </table>
  </div>

  <!-- MONETIZATION -->
  <div style="margin: 20px; background: rgba(255,215,0,0.1); border: 2px solid #ffd700; padding: 20px;">
    <h3 style="color: #ffd700; margin: 0 0 15px 0; font-size: 18px; text-transform: uppercase;">MONETIZATION ACTIVE</h3>
    <table style="width: 100%; color: #fff; font-size: 14px;">
      <tr><td style="padding: 5px 0;">Subscription Tiers</td><td style="text-align: right; color: #ffd700;">$19.99 - $999/mo</td></tr>
      <tr><td style="padding: 5px 0;">AI Credits</td><td style="text-align: right; color: #ffd700;">$4.99 - $99.99</td></tr>
      <tr><td style="padding: 5px 0;">Brand Deals</td><td style="text-align: right; color: #ffd700;">MARKETPLACE LIVE</td></tr>
    </table>
  </div>

  <!-- APPS -->
  <div style="margin: 20px; background: rgba(0,212,255,0.1); border: 2px solid #00d4ff; padding: 20px;">
    <h3 style="color: #00d4ff; margin: 0 0 15px 0; font-size: 18px; text-transform: uppercase;">10 APPS DEPLOYED</h3>
    <p style="color: #ccc; margin: 0; font-size: 13px; line-height: 1.8;">
      Portal | Messenger | Diamond Grind | Warriors Playbook | Transfer Portal | NIL Vault | AI Sales | Faith | AI Recruiter | AI Content
    </p>
  </div>

  <!-- QUOTE -->
  <div style="text-align: center; padding: 30px 20px; border-top: 1px solid #333; border-bottom: 1px solid #333; margin: 20px;">
    <p style="color: #ffd700; font-size: 22px; margin: 0; font-style: italic;">"Dreams Do Come True 2026"</p>
    <p style="color: #00d4ff; font-size: 16px; margin: 10px 0 0 0;">ONE PERSON BILLIONAIRE - THE PERFECT STORM</p>
  </div>

  <!-- FOOTER -->
  <div style="background: #000; padding: 20px; text-align: center; border-top: 2px solid #002244;">
    <p style="color: #ffd700; margin: 0 0 5px 0; font-size: 14px; font-weight: bold;">ATHLYNX CORPORATION</p>
    <p style="color: #666; margin: 0; font-size: 11px;">A Dozier Holdings Group Company</p>
    <p style="color: #444; margin: 10px 0 0 0; font-size: 10px;">12036 Lake Portal Drive, Houston, TX 77047</p>
  </div>

</div>
</body>
</html>
`;

// SMS MESSAGE - SHORT AND POWERFUL
const smsMessage = `ATHLYNX AI - WE ARE LIVE

ALL SYSTEMS GO:
- 10 Apps Deployed
- 41 AI Models Ready
- Stripe Connected
- Monetization Active

THE CORPORATE PLAYBOOK IS READY.

One Person Billionaire.
Dreams Do Come True 2026.

- ATHLYNX Team`;

async function sendBlast() {
  console.log('SENDING TEAM BLAST - DARK SPORTS THEME');
  console.log('=====================================\n');

  // Send emails with delay
  for (const member of team) {
    await new Promise(r => setTimeout(r, 700));
    try {
      await resend.emails.send({
        from: 'ATHLYNX AI <noreply@athlynx.ai>',
        to: member.email,
        subject: subject,
        html: htmlBody
      });
      console.log('EMAIL SENT:', member.name, '-', member.email);
    } catch (err) {
      console.log('EMAIL FAILED:', member.name, '-', err.message);
    }
  }

  // Send SMS to Chad
  console.log('\n--- SENDING SMS ---');
  try {
    const result = await twilioClient.messages.create({
      body: smsMessage,
      from: TWILIO_PHONE,
      to: '+16014985282'
    });
    console.log('SMS SENT to Chad! SID:', result.sid);
  } catch (err) {
    console.log('SMS FAILED:', err.message);
  }

  console.log('\n=====================================');
  console.log('TEAM BLAST COMPLETE!');
}

sendBlast();
