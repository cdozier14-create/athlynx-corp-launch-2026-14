# Unified API Service

## Purpose
Consolidated FastAPI backend serving all applications in the DHG ecosystem.

## Features
- **Authentication Module** - Unified auth across all apps
- **CRM Module** - Customer relationship management
- **Stripe Integration** - Payment processing for all apps
- **Verification Service** - Athlete and user verification
- **Transfer Portal API** - Transfer management endpoints
- **Multi-app Routing** - Intelligent routing based on domain/subdomain

## Tech Stack
- Python 3.11
- FastAPI
- Uvicorn (ASGI server)
- Neon PostgreSQL
- Stripe SDK
- AWS SES/SNS

## API Endpoints

### Core Routes
- `/api/health` - Health check
- `/api/auth/*` - Authentication endpoints
- `/api/verification/*` - Verification endpoints
- `/api/stripe/*` - Payment processing
- `/api/crm/*` - CRM endpoints

### App-Specific Routes
- `/api/athlynx/*` - Athlynx platform endpoints
- `/api/transferportal/*` - Transfer portal endpoints
- `/api/vip/*` - VIP app endpoints
- `/api/diamond-grind/*` - Diamond Grind endpoints

## Deployment
- **Platform:** Render.com / Railway.app
- **Environment:** Production
- **Database:** Neon PostgreSQL (ep-bold-bar-aegw1i6x-pooler.us-east-2.aws.neon.tech)

## Environment Variables
See `.env.example` for complete configuration.

## Running Locally
```bash
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Running in Production
```bash
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```
