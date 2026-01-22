# ATHLYNX Julia Frontend

Server-side rendered frontend for SEO optimization.

## Features

- ✅ HTTP server on port 8000
- ✅ Server-side rendering for SEO
- ✅ Routes: /, /signup, /patents, /checkout, /dashboard
- ✅ TLS/SSL ready for production
- ✅ Stripe integration ready
- ✅ API proxy to Python backend

## Setup

### Install Julia Dependencies

```bash
cd julia-frontend
julia --project=. -e 'using Pkg; Pkg.instantiate()'
```

## Run Server

```bash
julia --project=. src/app.jl
```

Server will start at http://localhost:8000

## Environment Variables

Set these before running:

- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `API_URL` - Python backend API URL (default: https://athlynx.ai/api)

## Production Deployment

Deploy to Netlify or any Julia-compatible hosting:

1. Build static assets
2. Configure TLS/SSL
3. Set environment variables
4. Deploy

## Routes

- `/` - Homepage with hero section
- `/signup` - User signup form
- `/patents` - Patent listing and pricing
- `/checkout` - Stripe checkout redirect
- `/dashboard` - User dashboard
- `/api/*` - Proxy to Python backend

## Author

Chad A. Dozier - ATHLYNX Corporation
Dreams Do Come True 2026 🦁
