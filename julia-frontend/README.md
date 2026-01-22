# ATHLYNX Julia Frontend

High-performance web frontend built with Julia and Genie framework.

## Features

- ✅ Server-side rendering for SEO optimization
- ✅ Integration with Python FastAPI backend
- ✅ Stripe checkout for patent purchases
- ✅ 5 main pages: Homepage, Signup, Patents, Checkout, Dashboard
- ✅ TailwindCSS for responsive design
- ✅ API proxy to Python backend

## Setup

### Install Julia Dependencies

```bash
cd julia-frontend
julia --project=. -e 'using Pkg; Pkg.instantiate()'
```

### Environment Variables

Required environment variables:
- `JULIA_PORT` - Port for Julia server (default: 8000)
- `PYTHON_API_URL` - URL to Python FastAPI backend
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

### Run Server

```bash
julia --project=. src/app.jl
```

Or with environment variables:

```bash
JULIA_PORT=8000 PYTHON_API_URL=http://localhost:8080 julia --project=. src/app.jl
```

## Pages

1. **Homepage** (`/`) - "THE PERFECT STORM" landing page
2. **Signup** (`/signup`) - User registration and waitlist
3. **Patents** (`/patents`) - 5 US Patents showcase
4. **Checkout** (`/checkout`) - Stripe payment integration
5. **Dashboard** (`/dashboard`) - Access to 10 apps

## Deployment

The Julia frontend integrates with Netlify deployment. See main `netlify.toml` for configuration.

## Architecture

- **Genie Framework** - High-performance web framework for Julia
- **HTTP.jl** - HTTP client for API proxying
- **JSON.jl** - JSON serialization
- **Server-side rendering** - HTML templates rendered on server for SEO

## API Integration

All `/api/*` routes are proxied to the Python FastAPI backend, allowing seamless integration between Julia frontend and Python backend services.

---

**ATHLYNX AI Corporation - Dreams Do Come True 2026 🦁**
