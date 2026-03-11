import { Product, User, Order, Message, StaffMember, FlashSale, Broadcast } from './types';
import { generateId, generateReferralCode } from './utils';

// =========================================
// PRODUCTS
// =========================================
export const PRODUCTS_SEED: Product[] = [
  // FASHION
  {
    id: 'f1', category: 'fashion', subcategory: 'clothing',
    name: 'BC Signature Hoodie', price: 200, badge: 'POPULAR',
    tags: ['COTTON', 'UNISEX'],
    description: 'Heavy cotton hoodie with embroidered BC hexagon logo. Available in black and charcoal.',
    image: '/images/hoodie-1.png', stock: 24, inStock: true, preOrder: false,
  },
  {
    id: 'f2', category: 'fashion', subcategory: 'clothing',
    name: 'BC Premium Hoodie', price: 250, badge: 'NEW DROP',
    tags: ['PREMIUM COTTON', 'OVERSIZED'],
    description: 'Premium oversized hoodie with gold foil BC logo. Limited edition drop.',
    image: '/images/hoodie-2.png', stock: 12, inStock: true, preOrder: false,
  },
  {
    id: 'f3', category: 'fashion', subcategory: 'clothing',
    name: 'BC Gold Series Tee', price: 250, badge: '',
    tags: ['COTTON', 'GOLD PRINT'],
    description: 'Premium cotton tee with gold foil BC logo print. Heavyweight 220gsm.',
    image: '/images/photo-1.jpg', stock: 30, inStock: true, preOrder: false,
  },
  {
    id: 'f4', category: 'fashion', subcategory: 'clothing',
    name: 'BC Cargo Pants', price: 550, badge: 'NEW DROP',
    tags: ['STREETWEAR', 'UNISEX'],
    description: 'Tactical cargo pants with BC branding at the hip. Multiple pockets, relaxed fit.',
    image: '/images/photo-2.jpg', stock: 8, inStock: true, preOrder: false,
  },
  {
    id: 'f5', category: 'fashion', subcategory: 'accessories',
    name: 'BC Cap', price: 180, badge: '',
    tags: ['ADJUSTABLE', 'UNISEX'],
    description: 'Embroidered BC hexagon cap. One size fits all with adjustable strap.',
    image: '/images/photo-3.jpg', stock: 40, inStock: true, preOrder: false,
  },
  // TECH
  {
    id: 't1', category: 'tech', subcategory: 'phones',
    name: 'Google Pixel 7 Pro', price: 6500, badge: 'IN STOCK',
    tags: ['GOOGLE', '256GB', 'SEALED'],
    description: 'Google Pixel 7 Pro. 256GB. Genuine sealed unit with full warranty.',
    image: '/images/pixel-7-pro.png', stock: 5, inStock: true, preOrder: false,
  },
  {
    id: 't2', category: 'tech', subcategory: 'phones',
    name: 'iPhone 11 256GB', price: 5500, badge: 'IN STOCK',
    tags: ['APPLE', '256GB', 'SEALED'],
    description: 'Brand new iPhone 11 256GB. Genuine Apple sealed box with warranty.',
    image: '/images/iphone-11-256gb.png', stock: 7, inStock: true, preOrder: false,
  },
  {
    id: 't3', category: 'tech', subcategory: 'phones',
    name: 'Samsung Galaxy S21 Ultra', price: 7000, badge: 'POPULAR',
    tags: ['SAMSUNG', '256GB', 'SEALED'],
    description: 'Samsung Galaxy S21 Ultra. 256GB. Genuine with local warranty.',
    image: '/images/samsung-s21-ultra.png', stock: 4, inStock: true, preOrder: false,
  },
  {
    id: 't4', category: 'tech', subcategory: 'phones',
    name: 'Huawei Honor', price: 700, badge: '',
    tags: ['HUAWEI', 'BUDGET'],
    description: 'Huawei Honor smartphone. Reliable, fast, feature-packed at an accessible price.',
    image: '/images/huawei-honour.png', stock: 10, inStock: true, preOrder: false,
  },
  {
    id: 't5', category: 'tech', subcategory: 'phones',
    name: 'Huawei Y7', price: 700, badge: '',
    tags: ['HUAWEI', 'BUDGET'],
    description: 'Huawei Y7. Big battery, large display, and great value for money.',
    image: '/images/huawei-y7.png', stock: 8, inStock: true, preOrder: false,
  },
  {
    id: 't6', category: 'tech', subcategory: 'phones',
    name: 'iPhone 11', price: 5000, badge: 'BESTSELLER',
    tags: ['APPLE', 'BRAND NEW'],
    description: 'Brand new iPhone 11. Genuine Apple product with full warranty. Sealed box.',
    image: '/images/iphone-11.png', stock: 6, inStock: true, preOrder: false,
  },
  {
    id: 't7', category: 'tech', subcategory: 'phones',
    name: 'iPhone 13', price: 7500, badge: 'POPULAR',
    tags: ['APPLE', '128GB'],
    description: 'iPhone 13. Genuine, sealed. Advanced dual camera system.',
    image: '/images/iphone-13.png', stock: 5, inStock: true, preOrder: false,
  },
  {
    id: 't8', category: 'tech', subcategory: 'phones',
    name: 'iPhone 13 Boxed Set', price: 7500, badge: 'IN STOCK',
    tags: ['APPLE', '128GB', 'FULL SET'],
    description: 'iPhone 13 complete boxed set with all accessories. Full manufacturer warranty.',
    image: '/images/iphone-13-boxed.png', stock: 3, inStock: true, preOrder: false,
  },
  {
    id: 't9', category: 'tech', subcategory: 'phones',
    name: 'Oppo Smartphone', price: 700, badge: '',
    tags: ['OPPO', 'BUDGET'],
    description: 'Oppo budget smartphone. Quality camera, fast charging, sleek design.',
    image: '/images/oppo.png', stock: 9, inStock: true, preOrder: false,
  },
  {
    id: 't10', category: 'tech', subcategory: 'accessories',
    name: 'JBL Pure Bass Speaker', price: 500, badge: 'NEW',
    tags: ['AUDIO', 'BLUETOOTH', 'WATERPROOF'],
    description: 'JBL Pure Bass portable Bluetooth speaker. Deep bass, waterproof, 12h battery.',
    image: '/images/jbl-speaker.png', stock: 15, inStock: true, preOrder: false,
  },
  {
    id: 't11', category: 'tech', subcategory: 'accessories',
    name: 'Kids Tablet', price: 1500, badge: 'POPULAR',
    tags: ['KIDS', 'EDUCATIONAL', 'DURABLE'],
    description: 'Durable educational tablet for kids. Pre-loaded with learning apps and parental controls.',
    image: '/images/kids-tablet.png', stock: 11, inStock: true, preOrder: false,
  },
];

// =========================================
// DEMO USERS
// =========================================
export const USERS_SEED: User[] = [
  {
    id: 'u_demo',
    name: 'Demo Customer',
    email: 'demo@bci.zm',
    phone: '+260977000001',
    password: 'demo1234',
    loyaltyPoints: 1250,
    loyaltyTier: 'Gold',
    referralCode: 'DC7X2A',
    addresses: [
      {
        id: 'addr1',
        label: 'Home',
        street: '14 Kaunda Square',
        area: 'Kaunda Square',
        city: 'Lusaka',
        isDefault: true,
      },
    ],
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'u_mwamba',
    name: 'Mwamba Zulu',
    email: 'mwamba@gmail.com',
    phone: '+260977112233',
    password: 'test1234',
    loyaltyPoints: 320,
    loyaltyTier: 'Bronze',
    referralCode: 'MZ8K3Q',
    addresses: [],
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'u_thandiwe',
    name: 'Thandiwe Banda',
    email: 'thandiwe@gmail.com',
    phone: '+260966445566',
    password: 'test1234',
    loyaltyPoints: 780,
    loyaltyTier: 'Silver',
    referralCode: 'TB9R2M',
    addresses: [],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'u_chisomo',
    name: 'Chisomo Phiri',
    email: 'chisomo@gmail.com',
    phone: '+260955778899',
    password: 'test1234',
    loyaltyPoints: 2700,
    loyaltyTier: 'Platinum',
    referralCode: 'CP4T8N',
    addresses: [],
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'u_kaputo',
    name: 'Kaputo Musonda',
    email: 'kaputo@gmail.com',
    phone: '+260977556677',
    password: 'test1234',
    loyaltyPoints: 145,
    loyaltyTier: 'Bronze',
    referralCode: 'KM5V1L',
    addresses: [],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'u_natasha',
    name: 'Natasha Tembo',
    email: 'natasha@gmail.com',
    phone: '+260966889900',
    password: 'test1234',
    loyaltyPoints: 1050,
    loyaltyTier: 'Gold',
    referralCode: 'NT3W9B',
    addresses: [],
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// =========================================
// DEMO ORDERS
// =========================================
export const ORDERS_SEED: Order[] = [
  {
    id: 'ord_001', ref: 'BCI-482910',
    userId: 'u_demo', customerName: 'Demo Customer',
    customerPhone: '+260977000001', customerEmail: 'demo@bci.zm',
    items: [
      { productId: 't6', name: 'iPhone 11', price: 5000, quantity: 1, image: '/images/iphone-11.png' },
    ],
    subtotal: 5000, deliveryFee: 50, total: 5050,
    loyaltyPointsEarned: 1010, loyaltyPointsRedeemed: 0,
    paymentMethod: 'airtel',
    deliveryAddress: '14 Kaunda Square, Lusaka',
    status: 'delivered',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ord_002', ref: 'BCI-391047',
    userId: 'u_demo', customerName: 'Demo Customer',
    customerPhone: '+260977000001', customerEmail: 'demo@bci.zm',
    items: [
      { productId: 'f1', name: 'BC Signature Hoodie', price: 200, quantity: 2, image: '/images/hoodie-1.png' },
      { productId: 'f5', name: 'BC Cap', price: 180, quantity: 1, image: '/images/photo-3.jpg' },
    ],
    subtotal: 580, deliveryFee: 50, total: 630,
    loyaltyPointsEarned: 126, loyaltyPointsRedeemed: 0,
    paymentMethod: 'momo',
    deliveryAddress: '14 Kaunda Square, Lusaka',
    status: 'dispatched',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ord_003', ref: 'BCI-574832',
    userId: 'u_mwamba', customerName: 'Mwamba Zulu',
    customerPhone: '+260977112233', customerEmail: 'mwamba@gmail.com',
    items: [
      { productId: 't1', name: 'Google Pixel 7 Pro', price: 6500, quantity: 1, image: '/images/pixel-7-pro.png' },
    ],
    subtotal: 6500, deliveryFee: 50, total: 6550,
    loyaltyPointsEarned: 655, loyaltyPointsRedeemed: 0,
    paymentMethod: 'card',
    deliveryAddress: 'Northmead, Lusaka',
    status: 'processing',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ord_004', ref: 'BCI-109283',
    userId: 'u_thandiwe', customerName: 'Thandiwe Banda',
    customerPhone: '+260966445566', customerEmail: 'thandiwe@gmail.com',
    items: [
      { productId: 't3', name: 'Samsung Galaxy S21 Ultra', price: 7000, quantity: 1, image: '/images/samsung-s21-ultra.png' },
    ],
    subtotal: 7000, deliveryFee: 0, total: 7000,
    loyaltyPointsEarned: 700, loyaltyPointsRedeemed: 200,
    paymentMethod: 'airtel',
    deliveryAddress: 'Woodlands, Lusaka',
    status: 'received',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ord_005', ref: 'BCI-837461',
    userId: 'u_chisomo', customerName: 'Chisomo Phiri',
    customerPhone: '+260955778899', customerEmail: 'chisomo@gmail.com',
    items: [
      { productId: 't7', name: 'iPhone 13', price: 7500, quantity: 1, image: '/images/iphone-13.png' },
      { productId: 'f2', name: 'BC Premium Hoodie', price: 250, quantity: 1, image: '/images/hoodie-2.png' },
    ],
    subtotal: 7750, deliveryFee: 0, total: 7750,
    loyaltyPointsEarned: 1550, loyaltyPointsRedeemed: 0,
    paymentMethod: 'momo',
    deliveryAddress: 'Kabulonga, Lusaka',
    status: 'delivered',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// =========================================
// DEMO MESSAGES
// =========================================
export const MESSAGES_SEED: Message[] = [
  {
    id: 'msg1', customerId: 'u_mwamba', customer: 'Mwamba Zulu',
    message: 'Hi, do you have the iPhone 15 in stock?',
    time: '2m ago', read: false, platform: 'app',
    replies: [],
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg2', customerId: 'u_thandiwe', customer: 'Thandiwe Banda',
    message: 'What sizes do you have for the BC hoodie?',
    time: '5m ago', read: false, platform: 'app',
    replies: [],
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg3', customerId: 'u_chisomo', customer: 'Chisomo Phiri',
    message: 'Can I pre-order the Samsung S24?',
    time: '12m ago', read: true, platform: 'whatsapp',
    replies: [
      { id: 'r1', sender: 'admin', text: 'Hi Chisomo! The Samsung S24 will be available soon. We can put you on our pre-order list — want to proceed?', time: '10m ago' },
      { id: 'r2', sender: 'customer', text: 'Yes please! What deposit do I need?', time: '8m ago' },
    ],
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg4', customerId: 'u_kaputo', customer: 'Kaputo Musonda',
    message: 'Is the price negotiable for bulk order? I need 10 hoodies.',
    time: '25m ago', read: true, platform: 'app',
    replies: [],
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg5', customerId: 'u_natasha', customer: 'Natasha Tembo',
    message: 'Do you deliver to Kitwe?',
    time: '1h ago', read: true, platform: 'whatsapp',
    replies: [
      { id: 'r3', sender: 'admin', text: 'Hi Natasha! We do deliver outside Lusaka — Kitwe delivery is available. Contact us for exact pricing.', time: '55m ago' },
    ],
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
];

// =========================================
// DEMO STAFF
// =========================================
export const STAFF_SEED: StaffMember[] = [
  {
    id: 'staff_001', name: 'Brian Chanda', email: 'admin@bci.zm',
    role: 'owner', lastActive: 'Now', status: 'active',
    permissions: { orders: true, inventory: true, customers: true, analytics: true, broadcasts: true, staff: true, inbox: true },
  },
  {
    id: 'staff_002', name: 'Chanda Mwale', email: 'manager@bci.zm',
    role: 'manager', lastActive: '30m ago', status: 'active',
    permissions: { orders: true, inventory: true, customers: true, analytics: true, broadcasts: true, staff: false, inbox: true },
  },
  {
    id: 'staff_003', name: 'Bwalya Tembo', email: 'sales@bci.zm',
    role: 'sales', lastActive: '2h ago', status: 'active',
    permissions: { orders: true, inventory: false, customers: true, analytics: false, broadcasts: false, staff: false, inbox: true },
  },
  {
    id: 'staff_004', name: 'Mutale Mulenga', email: 'inventory@bci.zm',
    role: 'inventory', lastActive: '1d ago', status: 'active',
    permissions: { orders: false, inventory: true, customers: false, analytics: false, broadcasts: false, staff: false, inbox: false },
  },
];

// =========================================
// DEMO FLASH SALES
// =========================================
export const FLASH_SALES_SEED: FlashSale[] = [
  {
    id: 'fs_001',
    productId: 't10',
    productName: 'JBL Pure Bass Speaker',
    originalPrice: 500,
    salePrice: 350,
    percentOff: 30,
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
];

// =========================================
// DEMO BROADCASTS
// =========================================
export const BROADCASTS_SEED: Broadcast[] = [
  {
    id: 'bc_001',
    name: 'Weekend Flash Sale Alert',
    target: 'all',
    channel: 'in_app',
    message: '🔥 FLASH SALE THIS WEEKEND! Up to 30% off selected tech & fashion. Shop now on the BCI app!',
    estimatedReach: 420,
    actualReach: 387,
    openRate: 68,
    sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'sent',
  },
  {
    id: 'bc_002',
    name: 'Gold Tier VIP Access',
    target: 'gold_plus',
    channel: 'in_app',
    message: '⭐ EXCLUSIVE: Gold & Platinum members get first access to our new iPhone drops. Tap to view.',
    estimatedReach: 126,
    actualReach: 119,
    openRate: 81,
    sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'sent',
  },
];

// =========================================
// LOYALTY TIERS (static config)
// =========================================
export const LOYALTY_TIERS = [
  {
    name: 'Bronze' as const, min: 0, max: 499, color: '#CD7F32',
    perks: ['Early access to sales', '1 point per K10 spent'],
  },
  {
    name: 'Silver' as const, min: 500, max: 999, color: '#C0C0C0',
    perks: ['Free delivery on orders over K500', '1.5 points per K10 spent', 'Birthday bonus'],
  },
  {
    name: 'Gold' as const, min: 1000, max: 2499, color: '#C9A84C',
    perks: ['Free delivery always', '2 points per K10 spent', 'VIP flash sale access', 'Dedicated support'],
  },
  {
    name: 'Platinum' as const, min: 2500, max: 999999, color: '#E5E4E2',
    perks: ['All Gold perks', 'Personal shopper', '3 points per K10 spent', 'Exclusive drops first', 'Monthly gift'],
  },
];
