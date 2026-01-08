// ATHLYNX LOGIN CREDENTIALS EMAIL
// For Chad Allen Dozier Sr. - Founder/CEO/Co-Chief Imagineer

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
        <h2 style="color: #ffd700; font-size: 24px; margin: 0 0 10px 0; font-weight: bold;">YOUR LOGIN CREDENTIALS</h2>
        <p style="color: #ffffff; font-size: 14px; margin: 0;">
          Welcome back, Founder/CEO/Co-Chief Imagineer
        </p>
      </div>
      
      <!-- CREDENTIALS BOX -->
      <div style="background-color: #0a1628; padding: 30px; margin: 0 20px 20px 20px; border-radius: 8px; border: 1px solid #00d4ff;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="color: #888888; font-size: 12px; padding: 10px 0; text-transform: uppercase; letter-spacing: 1px;">Platform URL</td>
            <td style="color: #00d4ff; font-size: 14px; padding: 10px 0; text-align: right; font-weight: bold;">
              <a href="https://athlynx.manus.space" style="color: #00d4ff; text-decoration: none;">athlynx.manus.space</a>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="border-bottom: 1px solid #1a365d;"></td>
          </tr>
          <tr>
            <td style="color: #888888; font-size: 12px; padding: 10px 0; text-transform: uppercase; letter-spacing: 1px;">Email</td>
            <td style="color: #ffffff; font-size: 14px; padding: 10px 0; text-align: right;">cdozier14@athlynx.ai</td>
          </tr>
          <tr>
            <td colspan="2" style="border-bottom: 1px solid #1a365d;"></td>
          </tr>
          <tr>
            <td style="color: #888888; font-size: 12px; padding: 10px 0; text-transform: uppercase; letter-spacing: 1px;">Password</td>
            <td style="color: #ffffff; font-size: 14px; padding: 10px 0; text-align: right;">Athlynx2026!</td>
          </tr>
          <tr>
            <td colspan="2" style="border-bottom: 1px solid #1a365d;"></td>
          </tr>
          <tr>
            <td style="color: #888888; font-size: 12px; padding: 10px 0; text-transform: uppercase; letter-spacing: 1px;">Role</td>
            <td style="color: #ffd700; font-size: 14px; padding: 10px 0; text-align: right; font-weight: bold;">Founder/CEO/Co-Chief Imagineer</td>
          </tr>
        </table>
      </div>
      
      <!-- CTA Button -->
      <div style="background-color: #1a365d; padding: 30px; text-align: center;">
        <a href="https://athlynx.manus.space/portal" style="display: inline-block; background: linear-gradient(135deg, #00d4ff, #0066cc); color: white; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
          SIGN IN NOW
        </a>
      </div>
      
      <!-- Special Note -->
      <div style="background-color: #0a1628; padding: 25px; text-align: center; border-top: 1px solid #ffd700;">
        <p style="color: #ffd700; font-size: 14px; margin: 0; font-style: italic;">
          "Co-Chief Imagineer" - The special bond between Chad & Glenn
        </p>
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
  subject: "ATHLYNX - Your Login Credentials - Founder/CEO/Co-Chief Imagineer",
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
  res.on("end", () => console.log("LOGIN EMAIL SENT:", body));
});
req.on("error", (e) => console.error("Error:", e.message));
req.write(data);
req.end();
