// Send Evening Report to Entire Team - January 7, 2026 @ 10:01 PM CST
import { Resend } from 'resend';

const resend = new Resend('re_ZQpN7oSa_e956Bzd312Bk881wDNJ1CB91');

const teamEmails = [
  'cdozier@dozierholdingsgroup.com',
  'glenntse@softmor.com',
  'jimmyboyd@athlynx.ai', 
  'andrewkustes@athlynx.ai',
  'leemarshall@athlynx.ai',
  'davidford@athlynx.ai',
  'nickileggett@athlynx.ai'
];

const subject = 'ATHLYNX AI - 10 PM Evening Report - January 7, 2026';

const htmlBody = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: white; padding: 20px;">
  <h1 style="color: #00d4ff; text-align: center;">ATHLYNX AI</h1>
  <h2 style="color: #ffd700; text-align: center;">Evening Status Report</h2>
  <p style="text-align: center;">January 7, 2026 | 10:00 PM CST</p>
  
  <hr style="border-color: #00d4ff;">
  
  <h3 style="color: #00ff88;">ALL SYSTEMS OPERATIONAL</h3>
  <ul>
    <li>Dev Server: RUNNING</li>
    <li>All 108+ files: SAFE</li>
    <li>Checkpoint: fbde21f8</li>
    <li>TypeScript: NO ERRORS</li>
    <li>Dependencies: OK</li>
  </ul>
  
  <h3 style="color: #00d4ff;">NEBIUS AI INTEGRATION</h3>
  <ul>
    <li>41 AI Models Available</li>
    <li>GitLab Token: Secured</li>
    <li>Ready for Manus API Link</li>
  </ul>
  
  <h3 style="color: #ffd700;">PLATFORM STATUS</h3>
  <ul>
    <li>10 Apps Built and Active</li>
    <li>8 AI Wizards Ready</li>
    <li>Transfer Portal: LIVE</li>
    <li>CRM Dashboard: ACTIVE</li>
    <li>Stripe Payments: CONNECTED</li>
  </ul>
  
  <h3 style="color: #ff6b6b;">THE PLAYBOOK</h3>
  <p>All game plan documents complete:</p>
  <ul>
    <li>THE_ATHLETES_PLAYBOOK_2026.pdf</li>
    <li>WEEKLY_GAME_PLANS_JAN_FEB_2026.pdf</li>
    <li>SUPER_BOWL_DRIVE_CHART.pdf</li>
    <li>ONE_PERSON_UNICORN_PROOF.pdf</li>
  </ul>
  
  <hr style="border-color: #00d4ff;">
  
  <p style="text-align: center; color: #ffd700; font-size: 18px;">
    <strong>Dreams Do Come True 2026</strong>
  </p>
  
  <p style="text-align: center; font-size: 12px; color: #888;">
    ATHLYNX Corporation | A Dozier Holdings Group Company<br>
    12036 Lake Portal Drive, Houston, TX 77047
  </p>
</div>
`;

async function sendEmails() {
  console.log('Sending Evening Report to team...');
  
  for (const email of teamEmails) {
    try {
      const { data, error } = await resend.emails.send({
        from: 'ATHLYNX AI <noreply@athlynx.ai>',
        to: email,
        subject: subject,
        html: htmlBody,
      });
      
      if (error) {
        console.log(`Failed to send to ${email}:`, error);
      } else {
        console.log(`Sent to ${email}`);
      }
    } catch (err) {
      console.log(`Error sending to ${email}:`, err.message);
    }
  }
  
  console.log('Evening Report distribution complete');
}

sendEmails();
