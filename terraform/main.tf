terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# Get the zone ID for athlynx.ai
data "cloudflare_zone" "athlynx_ai" {
  name = "athlynx.ai"
}

# A record for athlynx.ai pointing to Netlify
resource "cloudflare_record" "athlynx_ai_root" {
  zone_id = data.cloudflare_zone.athlynx_ai.id
  name    = "athlynx.ai"
  type    = "A"
  value   = "98.84.224.111"
  ttl     = 3600
  proxied = false
}

# A record for www.athlynx.ai pointing to Netlify
resource "cloudflare_record" "athlynx_ai_www" {
  zone_id = data.cloudflare_zone.athlynx_ai.id
  name    = "www"
  type    = "A"
  value   = "98.84.224.111"
  ttl     = 3600
  proxied = false
}

# Output the zone ID for reference
output "zone_id" {
  value       = data.cloudflare_zone.athlynx_ai.id
  description = "Cloudflare Zone ID for athlynx.ai"
}

output "dns_records" {
  value = {
    root = cloudflare_record.athlynx_ai_root.fqdn
    www  = cloudflare_record.athlynx_ai_www.fqdn
  }
  description = "DNS records created for athlynx.ai"
}
