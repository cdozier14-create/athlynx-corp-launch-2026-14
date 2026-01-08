// ATHLYNX WELCOME EMAIL - WITH LETTERHEAD AND LOGO
// Dark Navy Theme - Professional

import https from 'https';

const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; background-color: #0a1628;">
  <div style="background-color: #0a1628; padding: 40px 20px; font-family: Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #1a365d; border-radius: 12px; overflow: hidden; border: 2px solid #00d4ff;">
      
      <!-- LETTERHEAD WITH LOGO -->
      <div style="background: linear-gradient(135deg, #0a1628 0%, #1a365d 100%); padding: 30px; text-align: center; border-bottom: 3px solid #00d4ff;">
        <div style="background: linear-gradient(135deg, #00d4ff, #0066cc); width: 80px; height: 80px; border-radius: 16px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 36px; font-weight: bold;">A</span>
        </div>
        <h1 style="color: #00d4ff; font-size: 36px; margin: 0; font-weight: bold; letter-spacing: 3px;">ATHLYNX</h1>
        <p style="color: #ffffff; font-size: 14px; margin: 5px 0 0 0; letter-spacing: 2px;">THE ATHLETE'S PLAYBOOK</p>
      </div>
      
      <!-- WELCOME MESSAGE -->
      <div style="background-color: #1a365d; padding: 30px; text-align: center;">
        <h2 style="color: #ffd700; font-size: 28px; margin: 0 0 15px 0; font-weight: bold;">WELCOME TO THE TEAM!</h2>
        <p style="color: #ffffff; font-size: 16px; line-height: 1.8; margin: 0;">
          You are now part of something LEGENDARY.
        </p>
      </div>
      
      <!-- Date Bar -->
      <div style="background-color: #0a1628; padding: 20px; text-align: center;">
        <p style="color: #ffffff; font-size: 16px; margin: 0;">January 7, 2026</p>
        <div style="width: 80%; height: 2px; background: linear-gradient(90deg, transparent, #00d4ff, transparent); margin: 15px auto;"></div>
      </div>
      
      <!-- Status Section -->
      <div style="background-color: #1a365d; padding: 25px;">
        <h3 style="color: #00ff88; font-size: 18px; margin: 0 0 20px 0; font-weight: bold;">YOUR ACCESS IS NOW ACTIVE</h3>
        <ul style="color: #ffffff; font-size: 15px; line-height: 2.2; margin: 0; padding-left: 0; list-style: none;">
          <li style="margin-bottom: 8px;">&#10003; Platform Access: <span style="color: #00ff88; font-weight: bold;">GRANTED</span></li>
          <li style="margin-bottom: 8px;">&#10003; AI Wizards: <span style="color: #00d4ff; font-weight: bold;">8 AVAILABLE</span></li>
          <li style="margin-bottom: 8px;">&#10003; Transfer Portal: <span style="color: #00ff88; font-weight: bold;">LIVE</span></li>
          <li style="margin-bottom: 8px;">&#10003; NIL Calculator: <span style="color: #00ff88; font-weight: bold;">READY</span></li>
        </ul>
      </div>
      
      <!-- CTA Button -->
      <div style="background-color: #0a1628; padding: 30px; text-align: center;">
        <a href="https://athlynx.manus.space" style="display: inline-block; background: linear-gradient(135deg, #00d4ff, #0066cc); color: white; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
          ENTER THE PLATFORM
        </a>
      </div>
      
      <!-- W.I.N. Quote -->
      <div style="background: linear-gradient(135deg, #1a365d 0%, #0a1628 100%); padding: 25px; text-align: center; border-top: 2px solid #ffd700;">
        <p style="color: #ffd700; font-size: 18px; margin: 0; font-weight: bold;">W.I.N.</p>
        <p style="color: #ffffff; font-size: 14px; margin: 5px 0 0 0; font-style: italic;">WHAT'S IMPORTANT NOW!</p>
        <p style="color: #888888; font-size: 12px; margin: 10px 0 0 0;">- Lou Holtz, Legendary Coach</p>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #0a1628; padding: 20px; text-align: center; border-top: 1px solid #1a365d;">
        <p style="color: #00d4ff; font-size: 12px; margin: 0; font-weight: bold;">CHAD AND MANUS</p>
        <p style="color: #888888; font-size: 11px; margin: 8px 0 0 0;">ATHLYNX Corporation | A Dozier Holdings Group Company</p>
        <p style="color: #ffd700; font-size: 11px; margin: 5px 0 0 0;">DREAMS DO COME TRUE 2026</p>
      </div>
      
    </div>
  </div>
</body>
</html>
`;

const data = JSON.stringify({
  from: "ATHLYNX AI <noreply@athlynx.ai>",
  to: "cdozier14@dozierholdingsgroup.com.mx",
  subject: "WELCOME TO ATHLYNX - Your Access is Now Active",
  html: emailHtml
});

const options = {
  hostname: "api.resend.com",
  path: "/emails",
  method: "POST",
  headers: {
    "Authorization": "Bearer re_ZQpN7oSa_e956Bzd312Bk881wDNJ1CB91",
    "Content-Type": "application/json",
    "Content-Length": data.length
  }
};

const req = https.request(options, (res) => {
  let body = "";
  res.on("data", chunk => body += chunk);
  res.on("end", () => console.log("WELCOME EMAIL SENT:", body));
});
req.on("error", (e) => console.error("Error:", e.message));
req.write(data);
req.end();
