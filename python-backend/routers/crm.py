"""
ATHLYNX AI Platform - CRM Router
"""
from fastapi import APIRouter, HTTPException, Cookie
from typing import Optional
from database import get_db_connection
from auth import verify_jwt_token

router = APIRouter(prefix="/crm", tags=["CRM"])

@router.get("/dashboard")
async def get_crm_dashboard(athlynx_token: Optional[str] = Cookie(None)):
    """Get CRM dashboard data"""
    if not athlynx_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    payload = verify_jwt_token(athlynx_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        # Total users
        cursor.execute("SELECT COUNT(*) as total FROM users")
        total_users = cursor.fetchone()['total']
        
        # Total waitlist
        cursor.execute("SELECT COUNT(*) as total FROM waitlist")
        total_waitlist = cursor.fetchone()['total']
        
        # Recent signups
        cursor.execute("""
            SELECT id, email, first_name, last_name, created_at
            FROM users
            ORDER BY created_at DESC
            LIMIT 10
        """)
        recent_signups = cursor.fetchall()
        
        # Users by role
        cursor.execute("""
            SELECT role, COUNT(*) as count
            FROM users
            GROUP BY role
        """)
        users_by_role = cursor.fetchall()
        
        return {
            "success": True,
            "total_users": total_users,
            "total_waitlist": total_waitlist,
            "recent_signups": recent_signups,
            "users_by_role": users_by_role
        }
        
    finally:
        cursor.close()
        conn.close()

@router.get("/analytics")
async def get_analytics(athlynx_token: Optional[str] = Cookie(None)):
    """Get platform analytics"""
    if not athlynx_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    payload = verify_jwt_token(athlynx_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        # Total posts
        cursor.execute("SELECT COUNT(*) as total FROM posts")
        total_posts = cursor.fetchone()['total']
        
        # Total messages
        cursor.execute("SELECT COUNT(*) as total FROM messages")
        total_messages = cursor.fetchone()['total']
        
        # Active athletes
        cursor.execute("SELECT COUNT(*) as total FROM athlete_profiles")
        active_athletes = cursor.fetchone()['total']
        
        return {
            "success": True,
            "total_posts": total_posts,
            "total_messages": total_messages,
            "active_athletes": active_athletes
        }
        
    finally:
        cursor.close()
        conn.close()

@router.get("/signups")
async def get_signups(athlynx_token: Optional[str] = Cookie(None)):
    """Get real-time signup feed"""
    if not athlynx_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    payload = verify_jwt_token(athlynx_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        # Get recent signups with detailed info
        cursor.execute("""
            SELECT 
                id as signup_number,
                created_at as timestamp,
                first_name,
                last_name,
                email,
                phone,
                role,
                sport,
                device_info,
                browser_info,
                os_info,
                ip_address,
                geolocation,
                conversion_status,
                lifetime_value
            FROM users
            ORDER BY created_at DESC
            LIMIT 100
        """)
        signups = cursor.fetchall()
        
        return {
            "success": True,
            "signups": signups,
            "total": len(signups)
        }
        
    finally:
        cursor.close()
        conn.close()

@router.get("/stats")
async def get_stats(athlynx_token: Optional[str] = Cookie(None)):
    """Get live metrics and statistics"""
    if not athlynx_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    payload = verify_jwt_token(athlynx_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        # Total users
        cursor.execute("SELECT COUNT(*) as total FROM users")
        total_users = cursor.fetchone()['total']
        
        # Premium members
        cursor.execute("SELECT COUNT(*) as total FROM users WHERE subscription_status = 'active'")
        premium_members = cursor.fetchone()['total']
        
        # Total revenue
        cursor.execute("SELECT SUM(amount) as total FROM payments WHERE status = 'succeeded'")
        result = cursor.fetchone()
        total_revenue = result['total'] if result and result['total'] else 0
        
        # Signups today
        cursor.execute("""
            SELECT COUNT(*) as total FROM users 
            WHERE DATE(created_at) = CURDATE()
        """)
        signups_today = cursor.fetchone()['total']
        
        # By role
        cursor.execute("""
            SELECT role, COUNT(*) as count
            FROM users
            GROUP BY role
        """)
        users_by_role = cursor.fetchall()
        
        # By sport
        cursor.execute("""
            SELECT sport, COUNT(*) as count
            FROM users
            WHERE sport IS NOT NULL
            GROUP BY sport
        """)
        users_by_sport = cursor.fetchall()
        
        return {
            "success": True,
            "total_users": total_users,
            "premium_members": premium_members,
            "total_revenue": total_revenue,
            "signups_today": signups_today,
            "users_by_role": users_by_role,
            "users_by_sport": users_by_sport
        }
        
    finally:
        cursor.close()
        conn.close()

