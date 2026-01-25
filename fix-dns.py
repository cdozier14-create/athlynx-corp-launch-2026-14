#!/usr/bin/env python3
"""
Fix athlynx.ai DNS records - Delete conflicting records and keep ONLY Netlify
Run this from your local machine (not the sandbox)
"""

import requests
import sys

# Your Cloudflare API token
API_TOKEN = "1Si_VPZGvRHZn55xwZ3CRcH1ltDByKHfWMcpY-jt"
DOMAIN = "athlynx.ai"
NETLIFY_IP = "98.84.224.111"
VERCEL_IP = "18.208.88.157"

# Cloudflare API headers
HEADERS = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json"
}

def get_zone_id():
    """Get the zone ID for athlynx.ai"""
    url = f"https://api.cloudflare.com/client/v4/zones?name={DOMAIN}"
    response = requests.get(url, headers=HEADERS)
    
    if response.status_code != 200:
        print(f"❌ Error getting zone: {response.json()}")
        return None
    
    zones = response.json()["result"]
    if not zones:
        print(f"❌ Zone {DOMAIN} not found")
        return None
    
    zone_id = zones[0]["id"]
    print(f"✅ Found zone ID: {zone_id}")
    return zone_id

def get_dns_records(zone_id):
    """Get all DNS records for the zone"""
    url = f"https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records"
    response = requests.get(url, headers=HEADERS)
    
    if response.status_code != 200:
        print(f"❌ Error getting DNS records: {response.json()}")
        return []
    
    return response.json()["result"]

def delete_record(zone_id, record_id, record_name, record_value):
    """Delete a DNS record"""
    url = f"https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records/{record_id}"
    response = requests.delete(url, headers=HEADERS)
    
    if response.status_code == 200:
        print(f"✅ DELETED: {record_name} ({record_value})")
        return True
    else:
        print(f"❌ Failed to delete {record_name}: {response.json()}")
        return False

def main():
    print(f"\n🔧 Fixing DNS for {DOMAIN}")
    print(f"   Keeping ONLY: {NETLIFY_IP} (Netlify)")
    print(f"   Removing: {VERCEL_IP} (Vercel)")
    print(f"   Removing: Cloudflare nameserver records\n")
    
    # Get zone ID
    zone_id = get_zone_id()
    if not zone_id:
        sys.exit(1)
    
    # Get all DNS records
    print(f"\n📋 Current DNS records:")
    records = get_dns_records(zone_id)
    
    if not records:
        print("❌ No DNS records found")
        sys.exit(1)
    
    # Display all records
    for record in records:
        print(f"   {record['name']:30} {record['type']:5} {record.get('content', 'N/A')}")
    
    # Find records to delete
    print(f"\n🗑️  Deleting conflicting records...")
    deleted_count = 0
    
    for record in records:
        record_id = record["id"]
        record_name = record["name"]
        record_type = record["type"]
        record_value = record.get("content", "")
        
        # Delete Vercel A record
        if record_type == "A" and record_value == VERCEL_IP:
            if delete_record(zone_id, record_id, record_name, record_value):
                deleted_count += 1
        
        # Delete Cloudflare nameserver records (NS records pointing to p06.nsone.net)
        elif record_type == "NS" and "nsone.net" in record_value:
            if delete_record(zone_id, record_id, record_name, record_value):
                deleted_count += 1
    
    # Verify Netlify records exist
    print(f"\n✅ Verifying Netlify records...")
    records = get_dns_records(zone_id)
    netlify_records = [r for r in records if r.get("content") == NETLIFY_IP]
    
    if netlify_records:
        print(f"✅ Found {len(netlify_records)} Netlify records:")
        for record in netlify_records:
            print(f"   {record['name']:30} {record['type']:5} {record['content']}")
    else:
        print(f"⚠️  No Netlify records found - you may need to create them")
    
    print(f"\n{'='*50}")
    print(f"✅ DONE! Deleted {deleted_count} conflicting record(s)")
    print(f"{'='*50}\n")
    
    print(f"🌐 Verify DNS is fixed:")
    print(f"   dig athlynx.ai A")
    print(f"   dig www.athlynx.ai A")
    print(f"\n   Both should return: {NETLIFY_IP}\n")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
