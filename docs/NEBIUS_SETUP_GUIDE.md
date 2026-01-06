# Nebius AI Cloud Setup Guide for ATHLYNX

## Your Account Information

- **Email**: cdozier14@dozier-holdingsgroup.com.mx
- **Tenant**: plum-marsupial-tenant-utr
- **Status**: Active with tenant notifications enabled

---

## Step 1: Claim Your $5,000 Startup Credits

### How to Apply:

1. Go to: **https://nebius.com/startups**
2. Click "Apply Now" or "Get Started"
3. Fill out the application with:
   - **Company Name**: ATHLYNX / Dozier Holdings Group
   - **Your Role**: Founder/CEO
   - **Industry**: Sports Technology / AI
   - **Stage**: Pre-launch / Seed
   
4. **IMPORTANT**: In the description, mention:
   > "Robotics and Physical AI Awards applicant. Building an AI-powered athlete success platform using Nebius AI Cloud for ML training and inference."

5. Submit and wait for approval (usually 24-48 hours)

---

## Step 2: Set Up Billing

Even with credits, you need billing set up:

1. Go to: **console.nebius.com**
2. Navigate to: **Manage > Billing**
3. Add a payment method (credit card)
4. Minimum deposit: $25 (goes to your balance)

---

## Step 3: Your Available Resources (No Approval Needed)

Your account has immediate access to:

| Resource | Quantity | Use Case |
|----------|----------|----------|
| NVIDIA H200 GPUs | 8 | AI model training |
| NVIDIA H100 GPUs | 16 | Large-scale ML |
| NVIDIA L40S GPUs | 2 | Inference workloads |
| Object Storage | Unlimited | Data storage |
| Kubernetes | Managed | Container orchestration |

---

## Step 4: Create Your First Resource

### For ATHLYNX AI Features:

1. **Virtual Machine** (for development):
   - Go to: Compute > Virtual Machines
   - Click "Create VM"
   - Select: GPU-enabled instance
   - Choose: 1x H100 or L40S for testing

2. **GPU Cluster** (for training):
   - Go to: Compute > GPU Clusters
   - Create cluster with multiple GPUs
   - Use for: NIL valuation models, player matching AI

---

## Step 5: Integrate with ATHLYNX

### Python SDK Setup:

```bash
pip install nebius-sdk
```

### Configuration:

```python
import nebius

# Initialize client
client = nebius.Client(
    api_key="YOUR_API_KEY",
    tenant_id="plum-marsupial-tenant-utr"
)

# Use for ATHLYNX AI features
```

---

## Cost Estimates

With your $5,000 credits:

| Resource | Hourly Cost | Hours Available |
|----------|-------------|-----------------|
| 1x H100 GPU | ~$3.50/hr | ~1,400 hours |
| 1x H200 GPU | ~$4.50/hr | ~1,100 hours |
| 1x L40S GPU | ~$1.50/hr | ~3,300 hours |

---

## Support Contacts

- **Nebius Support**: support@nebius.com
- **Documentation**: https://docs.nebius.com
- **Status Page**: https://status.nebius.com

---

## Legal Note

ATHLYNX is a **customer** of Nebius AI Cloud. We use their infrastructure services. This is a standard vendor relationship, not a partnership or endorsement.

---

*Last Updated: January 6, 2026*
