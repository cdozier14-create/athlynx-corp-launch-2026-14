# Authentication Service

## Purpose
Unified authentication and authorization across all DHG applications.

## Features
- **Multi-app SSO** - Single sign-on across all platforms
- **JWT Tokens** - Secure token-based authentication
- **OAuth Integration** - Google, LinkedIn, Twitter OAuth
- **Email Verification** - Verify user email addresses
- **Phone Verification** - SMS-based phone verification
- **Role-based Access** - Admin, athlete, coach, fan roles
- **Session Management** - Secure session handling

## Authentication Flow

### Email/Password Login
1. User submits email/password
2. Server validates credentials
3. Generate JWT token with user claims
4. Return token + user data
5. Client stores token in localStorage/cookie

### Magic Link Login
1. User requests magic link via email
2. Server generates secure token
3. Send email with link containing token
4. User clicks link
5. Server validates token and creates session

### OAuth Login
1. User clicks "Login with Google"
2. Redirect to OAuth provider
3. Provider redirects back with authorization code
4. Exchange code for user data
5. Create/update user account
6. Generate JWT token

## API Endpoints

### Authentication
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/register` - Create new account
- `POST /api/auth/logout` - End session
- `POST /api/auth/magic-link` - Request magic link
- `POST /api/auth/verify-magic-link` - Verify magic link token

### OAuth
- `GET /api/auth/oauth/google` - Google OAuth
- `GET /api/auth/oauth/linkedin` - LinkedIn OAuth
- `GET /api/auth/oauth/callback` - OAuth callback handler

### Verification
- `POST /api/auth/send-verification` - Send verification email
- `POST /api/auth/verify-email` - Verify email token
- `POST /api/auth/send-phone-code` - Send SMS code
- `POST /api/auth/verify-phone` - Verify phone code

### Token Management
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/validate` - Validate token

## JWT Token Structure
```json
{
  "user_id": "user_123",
  "email": "user@example.com",
  "role": "athlete",
  "apps": ["athlynx", "transferportal"],
  "exp": 1234567890,
  "iat": 1234567890
}
```

## Environment Variables
- `JWT_SECRET` - Secret for signing JWT tokens
- `JWT_EXPIRES_IN` - Token expiration time (default: 7d)
- `OAUTH_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `OAUTH_GOOGLE_CLIENT_SECRET` - Google OAuth secret
