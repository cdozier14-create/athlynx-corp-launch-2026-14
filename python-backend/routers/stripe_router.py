"""
ATHLYNX AI Platform - Stripe Payments Router
"""
from fastapi import APIRouter, HTTPException, Cookie
from pydantic import BaseModel
from typing import Optional
import os
import stripe
from database import get_db_connection
from auth import verify_jwt_token

router = APIRouter(prefix="/patents", tags=["Patents & Payments"])

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

# Patent definitions
PATENTS = [
    {
        "id": "US-10123456",
        "number": "US 10,123,456",
        "name": "NIL Valuation Engine",
        "description": "AI-powered NIL valuation and market analysis",
        "price": 199,
        "price_id": "price_nil_valuation"
    },
    {
        "id": "US-10234567",
        "number": "US 10,234,567",
        "name": "Transfer Portal AI",
        "description": "Intelligent transfer portal matching and recommendations",
        "price": 199,
        "price_id": "price_transfer_portal"
    },
    {
        "id": "US-10345678",
        "number": "US 10,345,678",
        "name": "Athlete Playbook",
        "description": "Comprehensive career and life planning for athletes",
        "price": 199,
        "price_id": "price_athlete_playbook"
    },
    {
        "id": "US-10456789",
        "number": "US 10,456,789",
        "name": "Collective Matching",
        "description": "Smart matching between athletes and collectives",
        "price": 199,
        "price_id": "price_collective_matching"
    },
    {
        "id": "US-10567890",
        "number": "US 10,567,890",
        "name": "Career Trajectory AI",
        "description": "AI-driven career path analysis and optimization",
        "price": 199,
        "price_id": "price_career_trajectory"
    }
]

BUNDLE = {
    "name": "All 5 Patents Bundle",
    "description": "Complete access to all ATHLYNX patents",
    "price": 999,
    "price_id": "price_bundle_all",
    "savings": 196
}

@router.get("/list")
async def list_patents():
    """Get list of all available patents"""
    return {
        "success": True,
        "patents": PATENTS,
        "bundle": BUNDLE
    }

class CreateCheckoutSession(BaseModel):
    price_id: str
    success_url: str
    cancel_url: str
    bundle: Optional[bool] = False

@router.post("/create-checkout")
async def create_checkout(data: CreateCheckoutSession, athlynx_token: Optional[str] = Cookie(None)):
    """Create Stripe checkout session for patent purchase"""
    if not athlynx_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    payload = verify_jwt_token(athlynx_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Validate price_id
    valid_price_ids = [p['price_id'] for p in PATENTS] + [BUNDLE['price_id']]
    if data.price_id not in valid_price_ids:
        raise HTTPException(status_code=400, detail="Invalid price ID")
    
    try:
        # Get or create Stripe customer
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT stripe_customer_id, email, first_name, last_name FROM users WHERE id = %s", (payload['user_id'],))
        user = cursor.fetchone()
        
        stripe_customer_id = user['stripe_customer_id']
        if not stripe_customer_id:
            # Create Stripe customer
            customer = stripe.Customer.create(
                email=user['email'],
                name=f"{user['first_name']} {user['last_name']}"
            )
            stripe_customer_id = customer.id
            
            # Save to database
            cursor.execute(
                "UPDATE users SET stripe_customer_id = %s WHERE id = %s",
                (stripe_customer_id, payload['user_id'])
            )
            conn.commit()
        
        cursor.close()
        conn.close()
        
        # Determine price based on bundle selection
        # Bundle: $999/year for all 5 patents
        # Individual: $199/year per patent
        price_id = data.price_id
        
        # Create checkout session
        session = stripe.checkout.Session.create(
            customer=stripe_customer_id,
            payment_method_types=['card'],
            line_items=[{
                'price': price_id,
                'quantity': 1,
            }],
            mode='subscription',
            success_url=data.success_url,
            cancel_url=data.cancel_url,
            metadata={
                'user_id': payload['user_id'],
                'bundle': 'true' if data.bundle else 'false'
            }
        )
        
        return {"success": True, "session_id": session.id, "url": session.url}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/subscription")
async def get_subscription(athlynx_token: Optional[str] = Cookie(None)):
    """Get user's subscription status"""
    if not athlynx_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    payload = verify_jwt_token(athlynx_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute("""
            SELECT stripe_customer_id, stripe_subscription_id, subscription_status, subscription_tier
            FROM users
            WHERE id = %s
        """, (payload['user_id'],))
        
        user = cursor.fetchone()
        
        return {
            "success": True,
            "subscription_status": user['subscription_status'],
            "subscription_tier": user['subscription_tier'],
            "has_subscription": bool(user['stripe_subscription_id'])
        }
        
    finally:
        cursor.close()
        conn.close()

@router.post("/webhook")
async def stripe_webhook(request: dict):
    """Handle Stripe webhooks for payment processing"""
    try:
        event_type = request.get('type')
        
        if event_type == 'checkout.session.completed':
            session = request.get('data', {}).get('object', {})
            user_id = session.get('metadata', {}).get('user_id')
            is_bundle = session.get('metadata', {}).get('bundle') == 'true'
            
            if user_id:
                conn = get_db_connection()
                cursor = conn.cursor()
                
                # Update user subscription status
                cursor.execute("""
                    UPDATE users 
                    SET subscription_status = 'active',
                        subscription_tier = %s,
                        stripe_subscription_id = %s
                    WHERE id = %s
                """, ('bundle' if is_bundle else 'individual', session.get('subscription'), user_id))
                
                # Record payment
                cursor.execute("""
                    INSERT INTO payments (user_id, amount, status, stripe_payment_id, created_at)
                    VALUES (%s, %s, 'succeeded', %s, NOW())
                """, (user_id, session.get('amount_total', 0) / 100, session.get('id')))
                
                conn.commit()
                cursor.close()
                conn.close()
        
        return {"success": True, "event_type": event_type}
        
    except Exception as e:
        print(f"Webhook error: {e}")
        return {"success": False, "error": str(e)}

