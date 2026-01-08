// ATHLYNX BRANDED EMAIL - DARK NAVY THEME
// Matching IMG_0758 - Professional Sports Theme

import https from 'https';

const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a1628; font-family: Arial, sans-serif;">
  <div style="background-color: #0a1628; padding: 20px;">
    <div style="max-width: 400px; margin: 0 auto;">
      
      <!-- HEADER WITH LOGO - DARK NAVY -->
      <div style="background: linear-gradient(135deg, #1a365d 0%, #0a1628 100%); border-radius: 16px 16px 0 0; padding: 30px 20px; text-align: center; border: 2px solid #00d4ff; border-bottom: none;">
        <!-- Logo Box -->
        <div style="background: linear-gradient(135deg, #00d4ff, #0066cc); width: 60px; height: 60px; border-radius: 12px; margin: 0 auto 15px; display: inline-flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 28px; font-weight: bold;">A</span>
        </div>
        <h1 style="color: #00d4ff; font-size: 28px; margin: 0; font-weight: bold; letter-spacing: 2px;">ATHLYNX</h1>
        <p style="color: #ffffff; font-size: 12px; margin: 5px 0 0 0; letter-spacing: 1px; opacity: 0.8;">THE ATHLETE'S PLAYBOOK</p>
      </div>
      
      <!-- MAIN CONTENT - DARK NAVY -->
      <div style="background-color: #1a365d; padding: 25px 20px; border-left: 2px solid #00d4ff; border-right: 2px solid #00d4ff;">
        <h2 style="color: #ffd700; font-size: 20px; margin: 0 0 15px 0; font-weight: bold; text-align: center;">WELCOME TO THE TEAM!</h2>
        
        <p style="color: #ffffff; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0; text-align: center;">
          You are now part of something legendary. Your access is now active.
        </p>
        
        <!-- Status Box -->
        <div style="background-color: #0a1628; border-radius: 8px; padding: 15px; margin: 15px 0; border: 1px solid #00d4ff;">
          <p style="color: #00ff88; font-size: 14px; margin: 0 0 10px 0; font-weight: bold;">ALL SYSTEMS OPERATIONAL</p>
          <ul style="color: #ffffff; font-size: 13px; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Dev Server: RUNNING</li>
            <li>108+ files: SAFE</li>
            <li>Nebius: 41 AI Models Ready</li>
            <li>Stripe: CONNECTED</li>
          </ul>
        </div>
      </div>
      
      <!-- CTA BUTTON -->
      <div style="background-color: #1a365d; padding: 20px; text-align: center; border-left: 2px solid #00d4ff; border-right: 2px solid #00d4ff;">
        <a href="https://athlynx.manus.space/portal" style="display: inline-block; background: linear-gradient(135deg, #00d4ff, #0066cc); color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
          ACCESS PORTAL
        </a>
      </div>
      
      <!-- FOOTER - DARK NAVY -->
      <div style="background: linear-gradient(135deg, #0a1628 0%, #1a365d 100%); border-radius: 0 0 16px 16px; padding: 20px; text-align: center; border: 2px solid #00d4ff; border-top: 1px solid #00d4ff;">
        <p style="color: #ffd700; font-size: 12px; margin: 0; font-weight: bold;">CHAD AND MANUS</p>
        <p style="color: #888888; font-size: 10px; margin: 8px 0 0 0;">ATHLYNX Corporation | A Dozier Holdings Group Company</p>
        <p style="color: #00d4ff; font-size: 10px; margin: 5px 0 0 0;">DREAMS DO COME TRUE 2026</p>
      </div>
      
    </div>
  </div>
</body>
</html>
`;

const data = JSON.stringify({
  from: "ATHLYNX AI <noreply@athlynx.ai>",
  to: "cdozier14@dozierholdingsgroup.com.mx",
  subject: "ATHLYNX - Welcome to the Team!",
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
  res.on("end", () => console.log("BRANDED EMAIL SENT:", body));
});
req.on("error", (e) => console.error("Error:", e.message));
req.write(data);
req.end();
