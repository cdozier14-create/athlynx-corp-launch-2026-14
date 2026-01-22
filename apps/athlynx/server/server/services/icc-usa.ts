/**
 * ICC-USA Hardware Connector Service
 * 
 * Integration with ICC-USA for GPU hardware procurement
 * Reseller Agreement 2025 - ATHLYNX AI Corporation
 * 
 * @author ATHLYNX AI Corporation
 * @date January 7, 2026
 */

// ICC-USA Configuration
const ICC_USA_API_URL = process.env.ICC_USA_API_URL || 'https://api.icc-usa.com';
const ICC_USA_API_KEY = process.env.ICC_USA_API_KEY || '';
const ICC_USA_RESELLER_ID = process.env.ICC_USA_RESELLER_ID || 'DHG-2025';

/**
 * Available GPU Products from ICC-USA
 */
export const GPU_CATALOG = {
  // NVIDIA H-Series
  H100_SXM: {
    sku: 'NVIDIA-H100-SXM-80GB',
    name: 'NVIDIA H100 SXM 80GB',
    memory: '80GB HBM3',
    tdp: '700W',
    msrp: 30000,
    availability: 'In Stock',
  },
  H100_PCIE: {
    sku: 'NVIDIA-H100-PCIE-80GB',
    name: 'NVIDIA H100 PCIe 80GB',
    memory: '80GB HBM3',
    tdp: '350W',
    msrp: 25000,
    availability: 'In Stock',
  },
  H200_SXM: {
    sku: 'NVIDIA-H200-SXM-141GB',
    name: 'NVIDIA H200 SXM 141GB',
    memory: '141GB HBM3e',
    tdp: '700W',
    msrp: 35000,
    availability: 'Pre-Order',
  },
  
  // NVIDIA Blackwell Series
  B100: {
    sku: 'NVIDIA-B100-192GB',
    name: 'NVIDIA B100 192GB',
    memory: '192GB HBM3e',
    tdp: '700W',
    msrp: 40000,
    availability: 'Q2 2026',
  },
  B200: {
    sku: 'NVIDIA-B200-192GB',
    name: 'NVIDIA B200 192GB',
    memory: '192GB HBM3e',
    tdp: '1000W',
    msrp: 45000,
    availability: 'Q2 2026',
  },
  B300: {
    sku: 'NVIDIA-B300-288GB',
    name: 'NVIDIA B300 288GB',
    memory: '288GB HBM3e',
    tdp: '1200W',
    msrp: 55000,
    availability: 'Q3 2026',
  },
  
  // NVIDIA L-Series (Inference)
  L40S: {
    sku: 'NVIDIA-L40S-48GB',
    name: 'NVIDIA L40S 48GB',
    memory: '48GB GDDR6',
    tdp: '350W',
    msrp: 12000,
    availability: 'In Stock',
  },
  L4: {
    sku: 'NVIDIA-L4-24GB',
    name: 'NVIDIA L4 24GB',
    memory: '24GB GDDR6',
    tdp: '72W',
    msrp: 5000,
    availability: 'In Stock',
  },
} as const;

/**
 * Server Configurations
 */
export const SERVER_CONFIGS = {
  DGX_H100: {
    sku: 'NVIDIA-DGX-H100',
    name: 'NVIDIA DGX H100',
    gpus: 8,
    gpuModel: 'H100 SXM',
    memory: '640GB GPU + 2TB System',
    networking: '8x 400Gb InfiniBand',
    price: 300000,
    availability: 'In Stock',
  },
  DGX_B200: {
    sku: 'NVIDIA-DGX-B200',
    name: 'NVIDIA DGX B200',
    gpus: 8,
    gpuModel: 'B200',
    memory: '1.5TB GPU + 4TB System',
    networking: '8x 800Gb InfiniBand',
    price: 450000,
    availability: 'Q2 2026',
  },
  HGX_H100: {
    sku: 'NVIDIA-HGX-H100-8GPU',
    name: 'NVIDIA HGX H100 8-GPU',
    gpus: 8,
    gpuModel: 'H100 SXM',
    memory: '640GB GPU',
    networking: '8x 400Gb InfiniBand',
    price: 280000,
    availability: 'In Stock',
  },
  SUPERMICRO_4U: {
    sku: 'SMC-4U-8GPU-H100',
    name: 'Supermicro 4U 8-GPU Server',
    gpus: 8,
    gpuModel: 'H100 PCIe',
    memory: '640GB GPU + 1TB System',
    networking: '4x 100GbE',
    price: 220000,
    availability: 'In Stock',
  },
} as const;

/**
 * Quote Request Interface
 */
interface QuoteRequest {
  customerId: string;
  customerName: string;
  email: string;
  phone?: string;
  items: Array<{
    sku: string;
    quantity: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  notes?: string;
}

/**
 * Quote Response Interface
 */
interface QuoteResponse {
  quoteId: string;
  status: 'pending' | 'approved' | 'rejected';
  items: Array<{
    sku: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    availability: string;
    leadTime: string;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  validUntil: string;
  terms: string;
}

/**
 * Request a quote from ICC-USA
 */
export async function requestQuote(request: QuoteRequest): Promise<QuoteResponse> {
  // Calculate quote locally (API integration would be here)
  const items = request.items.map(item => {
    const product = Object.values({ ...GPU_CATALOG, ...SERVER_CONFIGS }).find(p => p.sku === item.sku);
    if (!product) {
      throw new Error(`Unknown SKU: ${item.sku}`);
    }
    
    // Reseller discount (15% off MSRP)
    const unitPrice = 'msrp' in product ? product.msrp * 0.85 : (product as any).price * 0.85;
    
    return {
      sku: item.sku,
      name: product.name,
      quantity: item.quantity,
      unitPrice,
      totalPrice: unitPrice * item.quantity,
      availability: product.availability,
      leadTime: product.availability === 'In Stock' ? '2-4 weeks' : '8-12 weeks',
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const shipping = subtotal > 100000 ? 0 : 2500; // Free shipping over $100K
  const tax = 0; // Tax exempt for resellers

  return {
    quoteId: `ICC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    status: 'pending',
    items,
    subtotal,
    shipping,
    tax,
    total: subtotal + shipping + tax,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    terms: 'Net 30 for approved resellers. 50% deposit required for pre-orders.',
  };
}

/**
 * Check product availability
 */
export function checkAvailability(sku: string): {
  available: boolean;
  status: string;
  leadTime: string;
  quantity?: number;
} {
  const product = Object.values({ ...GPU_CATALOG, ...SERVER_CONFIGS }).find(p => p.sku === sku);
  
  if (!product) {
    return {
      available: false,
      status: 'Unknown SKU',
      leadTime: 'N/A',
    };
  }

  const isInStock = product.availability === 'In Stock';
  
  return {
    available: isInStock,
    status: product.availability,
    leadTime: isInStock ? '2-4 weeks' : '8-12 weeks',
    quantity: isInStock ? Math.floor(Math.random() * 50) + 10 : 0, // Simulated inventory
  };
}

/**
 * Get reseller pricing for a product
 */
export function getResellerPrice(sku: string): {
  sku: string;
  msrp: number;
  resellerPrice: number;
  discount: number;
  margin: number;
} | null {
  const product = Object.values({ ...GPU_CATALOG, ...SERVER_CONFIGS }).find(p => p.sku === sku);
  
  if (!product) return null;

  const msrp = 'msrp' in product ? product.msrp : (product as any).price;
  const resellerPrice = msrp * 0.85; // 15% reseller discount
  
  return {
    sku,
    msrp,
    resellerPrice,
    discount: 0.15,
    margin: msrp - resellerPrice,
  };
}

/**
 * Calculate data center build cost
 */
export function calculateDataCenterBuild(config: {
  gpuModel: keyof typeof GPU_CATALOG;
  gpuCount: number;
  serverType: keyof typeof SERVER_CONFIGS;
  serverCount: number;
  networking: 'basic' | 'infiniband' | 'nvlink';
  cooling: 'air' | 'liquid' | 'immersion';
}): {
  hardware: number;
  networking: number;
  cooling: number;
  installation: number;
  total: number;
  breakdown: Record<string, number>;
} {
  const gpu = GPU_CATALOG[config.gpuModel];
  const server = SERVER_CONFIGS[config.serverType];
  
  // Hardware costs
  const gpuCost = ('msrp' in gpu ? gpu.msrp : 0) * config.gpuCount * 0.85;
  const serverCost = server.price * config.serverCount * 0.85;
  const hardware = gpuCost + serverCost;
  
  // Networking costs
  const networkingCosts = {
    basic: 50000,
    infiniband: 200000,
    nvlink: 350000,
  };
  const networking = networkingCosts[config.networking];
  
  // Cooling costs
  const coolingCosts = {
    air: 100000,
    liquid: 300000,
    immersion: 500000,
  };
  const cooling = coolingCosts[config.cooling];
  
  // Installation (10% of hardware)
  const installation = hardware * 0.10;
  
  return {
    hardware,
    networking,
    cooling,
    installation,
    total: hardware + networking + cooling + installation,
    breakdown: {
      'GPUs': gpuCost,
      'Servers': serverCost,
      'Networking': networking,
      'Cooling': cooling,
      'Installation': installation,
    },
  };
}

/**
 * Mississippi Data Center Configuration
 * For Charles Fu / Yovole Networks Partnership
 */
export const MS_DATA_CENTER_CONFIG = {
  location: 'Laurel, Mississippi',
  phase1: {
    name: 'Phase 1 - Initial Deployment',
    timeline: 'Q1 2026',
    gpus: 80, // 10 mobile units × 8 GPUs each
    gpuModel: 'H100 SXM',
    power: '2MW',
    cooling: 'Liquid (Yovole containers)',
    cost: calculateDataCenterBuild({
      gpuModel: 'H100_SXM',
      gpuCount: 80,
      serverType: 'HGX_H100',
      serverCount: 10,
      networking: 'infiniband',
      cooling: 'liquid',
    }).total,
  },
  phase2: {
    name: 'Phase 2 - Expansion',
    timeline: 'Q3 2026',
    gpus: 240,
    gpuModel: 'B200',
    power: '10MW',
    cooling: 'Immersion',
    cost: calculateDataCenterBuild({
      gpuModel: 'B200',
      gpuCount: 240,
      serverType: 'DGX_B200',
      serverCount: 30,
      networking: 'nvlink',
      cooling: 'immersion',
    }).total,
  },
  energyCost: 0.02, // $0.02/kWh stranded gas
  partner: 'Yovole Networks (Shanghai)',
  ownership: '100% US-owned (DHG Trust)',
};

/**
 * Check if ICC-USA API is configured
 */
export function isICCConfigured(): boolean {
  return !!ICC_USA_API_KEY && ICC_USA_API_KEY.length > 0;
}

export default {
  GPU_CATALOG,
  SERVER_CONFIGS,
  requestQuote,
  checkAvailability,
  getResellerPrice,
  calculateDataCenterBuild,
  MS_DATA_CENTER_CONFIG,
  isICCConfigured,
};
