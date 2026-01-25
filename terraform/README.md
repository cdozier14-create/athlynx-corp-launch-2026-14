# Cloudflare DNS Configuration for athlynx.ai

This Terraform configuration manages DNS records for athlynx.ai, ensuring it points ONLY to Netlify (98.84.224.111).

## What This Does

- ✅ Creates A record for `athlynx.ai` → `98.84.224.111` (Netlify)
- ✅ Creates A record for `www.athlynx.ai` → `98.84.224.111` (Netlify)
- ✅ Removes any conflicting DNS records (Vercel, Cloudflare, etc.)

## Prerequisites

1. **Terraform installed** - [Download here](https://www.terraform.io/downloads)
2. **Cloudflare API Token** - Get from https://dash.cloudflare.com/profile/api-tokens
   - Must have "Edit zone DNS" permissions
   - Token: `1Si_VPZGvRHZn55xwZ3CRcH1ltDByKHfWMcpY-jt`

## How to Apply

### Option 1: Using Environment Variable (Recommended)

```bash
cd terraform
export TF_VAR_cloudflare_api_token="1Si_VPZGvRHZn55xwZ3CRcH1ltDByKHfWMcpY-jt"
terraform init
terraform plan
terraform apply
```

### Option 2: Using terraform.tfvars

Create `terraform/terraform.tfvars`:
```hcl
cloudflare_api_token = "1Si_VPZGvRHZn55xwZ3CRcH1ltDByKHfWMcpY-jt"
```

Then run:
```bash
cd terraform
terraform init
terraform plan
terraform apply
```

## What Happens

1. **terraform init** - Initializes Terraform and downloads Cloudflare provider
2. **terraform plan** - Shows what changes will be made (review this!)
3. **terraform apply** - Applies the changes to Cloudflare

## Verification

After applying, verify DNS is correct:

```bash
# Check A record for athlynx.ai
dig athlynx.ai A

# Check A record for www.athlynx.ai
dig www.athlynx.ai A

# Both should return: 98.84.224.111
```

## Rollback

If something goes wrong:

```bash
cd terraform
terraform destroy
```

This will remove the DNS records created by Terraform.

## Troubleshooting

### "Cannot use the access token from location"
- The Cloudflare API token is IP-restricted
- Run Terraform from your local machine, not from the sandbox
- Or contact Cloudflare support to remove IP restrictions

### "Zone not found"
- Verify athlynx.ai is registered in your Cloudflare account
- Check that the API token has access to the zone

### "Permission denied"
- Verify the API token has "Edit zone DNS" permissions
- Create a new token with proper permissions if needed

## Files

- `main.tf` - Main Terraform configuration
- `variables.tf` - Variable definitions
- `terraform.tfstate` - State file (auto-generated, do not edit)
- `terraform.tfstate.backup` - Backup state file

## Next Steps

1. Run `terraform apply` to fix athlynx.ai DNS
2. Verify with `dig athlynx.ai A`
3. Test that athlynx.ai loads the Netlify site
4. Commit the Terraform files to GitHub for future reference
