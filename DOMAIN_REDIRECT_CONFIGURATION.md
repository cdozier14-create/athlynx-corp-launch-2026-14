# Domain Redirect Configuration

## Overview

This document explains the domain configuration and redirect setup for Athlynx Corporation.

## Primary Domain

**athlynxapp.vip** is the primary domain for the Athlynx platform.

All web traffic should be directed to: `https://athlynxapp.vip`

## Domain Redirects

### athlynx.ai → athlynxapp.vip

The domain **athlynx.ai** is configured to permanently redirect (301) to **athlynxapp.vip**.

This redirect is:
- **SEO-friendly**: Uses HTTP 301 status (permanent redirect)
- **Transparent**: Maintains the URL path and query parameters
- **Automatic**: Configured at the web server level (Netlify)

### Redirect Configuration Files

1. **netlify.toml** - Primary redirect configuration
   - Sets `athlynxapp.vip` as the primary domain
   - Configures 301 redirects from `athlynx.ai` to `athlynxapp.vip`
   - Handles both HTTP and HTTPS traffic

2. **client/public/_redirects** - Netlify redirects file
   - Backup redirect configuration
   - Ensures all traffic from `athlynx.ai` redirects to `athlynxapp.vip`

## Technical Details

### Redirect Rules

```
https://athlynx.ai/* → https://athlynxapp.vip/* (301)
http://athlynx.ai/* → https://athlynxapp.vip/* (301)
```

The `/*` wildcard and `:splat` parameter ensure that:
- All paths are preserved (e.g., `/signup` → `/signup`)
- Query parameters are maintained
- URL fragments are preserved

### SEO Considerations

**301 Permanent Redirect** signals to search engines that:
1. The content has permanently moved to the new location
2. Search engine rankings should transfer to the new domain
3. Existing backlinks will pass "link juice" to the new domain
4. The old domain (athlynx.ai) should be removed from search results over time

### Metadata Updates

The following files have been updated to reflect `athlynxapp.vip` as the primary domain:

- **client/index.html**: Canonical URLs, Open Graph tags, structured data
- **client/src/pages/*.tsx**: Domain references in Terms of Service, Privacy Policy, etc.
- **Documentation**: Deployment guides and configuration files

## DNS Configuration

### For athlynxapp.vip (Primary Domain)

Add these DNS records at your domain registrar:

```
Type: A
Name: @
Value: 75.2.60.5 (Netlify's IP)

Type: CNAME
Name: www
Value: [your-netlify-site].netlify.app
```

### For athlynx.ai (Redirect Domain)

1. Add the domain in Netlify dashboard
2. Configure DNS to point to Netlify
3. The redirect rules in netlify.toml will automatically handle the 301 redirect

## Testing the Redirect

### Command Line

```bash
# Test the redirect
curl -I https://athlynx.ai

# Should return:
# HTTP/2 301
# Location: https://athlynxapp.vip/
```

### Browser

1. Visit `https://athlynx.ai` in your browser
2. You should be automatically redirected to `https://athlynxapp.vip`
3. Check the browser's network tab to confirm 301 status

## Environment Variables

Update the following environment variable in Netlify:

```
FRONTEND_URL=https://athlynxapp.vip
```

This ensures the application logic uses the correct domain for:
- Email verification links
- Password reset links
- OAuth callbacks
- API responses

## Impact on Application Logic

The redirect is **transparent to application logic** because:

1. Redirects happen at the web server level (before application code runs)
2. Once redirected, all requests are to `athlynxapp.vip`
3. No code changes are required for URL handling
4. APIs and endpoints automatically use the correct domain

## Monitoring

After deployment, monitor:

1. **Netlify Analytics**: Ensure traffic is reaching `athlynxapp.vip`
2. **Search Console**: Track domain migration in Google Search Console
3. **Server Logs**: Verify 301 redirects are working correctly
4. **User Reports**: Monitor for any redirect-related issues

## Rollback Plan

If issues arise, the configuration can be reverted by:

1. Changing primary domain back to `athlynx.ai` in netlify.toml
2. Removing redirect rules
3. Redeploying the application

## Additional Domains

The Athlynx ecosystem includes other domains:

- **athlynx.io**: Developer Portal
- **athlynx.net**: Network Hub
- **transferportal.ai**: Transfer Portal

These domains are independent and do not redirect to `athlynxapp.vip`.

---

**Last Updated**: January 22, 2026
**Maintained By**: ATHLYNX AI Corporation
