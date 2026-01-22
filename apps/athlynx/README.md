# Athlynx.ai - Main Platform

**Domain:** athlynx.ai

## Purpose
The main Athlynx platform - a comprehensive athlete ecosystem for NIL deals, social networking, career development, and more.

## Features
- Athlete profiles and verification
- NIL deal marketplace
- Social feed and networking
- Career development tools
- AI-powered wizards (Agent, Lawyer, Financial, etc.)
- CRM and analytics

## Tech Stack
- **Frontend:** React + TypeScript + Vite
- **Backend:** Node.js + tRPC + Express
- **Database:** Neon PostgreSQL
- **Payments:** Stripe
- **Hosting:** Netlify

## Deployment
- **Primary Domain:** athlynx.ai
- **Platform:** Netlify
- **Build Command:** `pnpm install && pnpm run build`
- **Publish Directory:** `dist`

## Environment Variables
See `.env.example` for required configuration including:
- DATABASE_URL
- STRIPE_SECRET_KEY
- AWS credentials for SES/SNS
