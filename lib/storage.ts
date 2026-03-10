import { Cart, Order, User, Product, Message, Broadcast, FlashSale, StaffMember, LoyaltyTransaction } from './types';

export const KEYS = {
  USER:         'bci_user',
  USERS:        'bci_users',
  ORDERS:       'bci_orders',
  CART:         'bci_cart',
  PRODUCTS:     'bci_products',
  MESSAGES:     'bci_messages',
  BROADCASTS:   'bci_broadcasts',
  FLASH_SALES:  'bci_flash_sales',
  LOYALTY:      'bci_loyalty',
  STAFF:        'bci_staff',
  ADMIN_USER:   'bci_admin_user',
  SEEDED:       'bci_seeded',
} as const;

function isBrowser() {
  return typeof window !== 'undefined';
}

function getItem<T>(key: string): T | null {
  if (!isBrowser()) return null;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

function setItem<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage full or unavailable
  }
}

function removeItem(key: string): void {
  if (!isBrowser()) return;
  localStorage.removeItem(key);
}

// =========================================
// PRODUCTS
// =========================================
export const storageProducts = {
  get: (): Product[] => getItem<Product[]>(KEYS.PRODUCTS) ?? [],
  set: (products: Product[]) => setItem(KEYS.PRODUCTS, products),
  getById: (id: string): Product | null => {
    const products = storageProducts.get();
    return products.find(p => p.id === id) ?? null;
  },
  update: (id: string, updates: Partial<Product>) => {
    const products = storageProducts.get();
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...updates };
      storageProducts.set(products);
    }
  },
  add: (product: Product) => {
    const products = storageProducts.get();
    products.unshift(product);
    storageProducts.set(products);
  },
  delete: (id: string) => {
    const products = storageProducts.get().filter(p => p.id !== id);
    storageProducts.set(products);
  },
};

// =========================================
// CART
// =========================================
export const storageCart = {
  get: (): Cart => getItem<Cart>(KEYS.CART) ?? { items: [], updatedAt: new Date().toISOString() },
  set: (cart: Cart) => setItem(KEYS.CART, cart),
  clear: () => setItem(KEYS.CART, { items: [], updatedAt: new Date().toISOString() }),
};

// =========================================
// ORDERS
// =========================================
export const storageOrders = {
  get: (): Order[] => getItem<Order[]>(KEYS.ORDERS) ?? [],
  set: (orders: Order[]) => setItem(KEYS.ORDERS, orders),
  add: (order: Order) => {
    const orders = storageOrders.get();
    orders.unshift(order);
    storageOrders.set(orders);
  },
  updateStatus: (id: string, status: Order['status']) => {
    const orders = storageOrders.get();
    const idx = orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      orders[idx].status = status;
      orders[idx].updatedAt = new Date().toISOString();
      storageOrders.set(orders);
    }
  },
  getByUser: (userId: string): Order[] => {
    return storageOrders.get().filter(o => o.userId === userId);
  },
};

// =========================================
// USERS
// =========================================
export const storageUsers = {
  get: (): User[] => getItem<User[]>(KEYS.USERS) ?? [],
  set: (users: User[]) => setItem(KEYS.USERS, users),
  getByEmail: (email: string): User | null => {
    return storageUsers.get().find(u => u.email === email) ?? null;
  },
  update: (id: string, updates: Partial<User>) => {
    const users = storageUsers.get();
    const idx = users.findIndex(u => u.id === id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      storageUsers.set(users);
    }
  },
  add: (user: User) => {
    const users = storageUsers.get();
    users.push(user);
    storageUsers.set(users);
  },
  addLoyaltyPoints: (id: string, points: number) => {
    const users = storageUsers.get();
    const idx = users.findIndex(u => u.id === id);
    if (idx !== -1) {
      users[idx].loyaltyPoints += points;
      storageUsers.set(users);
    }
  },
};

// =========================================
// CURRENT USER SESSION
// =========================================
export const storageUser = {
  get: (): User | null => getItem<User>(KEYS.USER),
  set: (user: User) => setItem(KEYS.USER, user),
  clear: () => removeItem(KEYS.USER),
};

// =========================================
// ADMIN SESSION
// =========================================
export const storageAdminUser = {
  get: (): { email: string; role: string; name: string } | null =>
    getItem(KEYS.ADMIN_USER),
  set: (admin: { email: string; role: string; name: string }) =>
    setItem(KEYS.ADMIN_USER, admin),
  clear: () => removeItem(KEYS.ADMIN_USER),
};

// =========================================
// MESSAGES
// =========================================
export const storageMessages = {
  get: (): Message[] => getItem<Message[]>(KEYS.MESSAGES) ?? [],
  set: (messages: Message[]) => setItem(KEYS.MESSAGES, messages),
  markRead: (id: string) => {
    const messages = storageMessages.get();
    const idx = messages.findIndex(m => m.id === id);
    if (idx !== -1) {
      messages[idx].read = true;
      storageMessages.set(messages);
    }
  },
  addReply: (messageId: string, reply: import('./types').MessageReply) => {
    const messages = storageMessages.get();
    const idx = messages.findIndex(m => m.id === messageId);
    if (idx !== -1) {
      if (!messages[idx].replies) messages[idx].replies = [];
      messages[idx].replies!.push(reply);
      storageMessages.set(messages);
    }
  },
};

// =========================================
// BROADCASTS
// =========================================
export const storageBroadcasts = {
  get: (): Broadcast[] => getItem<Broadcast[]>(KEYS.BROADCASTS) ?? [],
  set: (broadcasts: Broadcast[]) => setItem(KEYS.BROADCASTS, broadcasts),
  add: (broadcast: Broadcast) => {
    const broadcasts = storageBroadcasts.get();
    broadcasts.unshift(broadcast);
    storageBroadcasts.set(broadcasts);
  },
};

// =========================================
// FLASH SALES
// =========================================
export const storageFlashSales = {
  get: (): FlashSale[] => getItem<FlashSale[]>(KEYS.FLASH_SALES) ?? [],
  set: (sales: FlashSale[]) => setItem(KEYS.FLASH_SALES, sales),
  add: (sale: FlashSale) => {
    const sales = storageFlashSales.get();
    sales.unshift(sale);
    storageFlashSales.set(sales);
  },
  toggle: (id: string) => {
    const sales = storageFlashSales.get();
    const idx = sales.findIndex(s => s.id === id);
    if (idx !== -1) {
      sales[idx].isActive = !sales[idx].isActive;
      storageFlashSales.set(sales);
    }
  },
};

// =========================================
// LOYALTY TRANSACTIONS
// =========================================
export const storageLoyalty = {
  get: (userId: string): LoyaltyTransaction[] => {
    const all = getItem<Record<string, LoyaltyTransaction[]>>(KEYS.LOYALTY) ?? {};
    return all[userId] ?? [];
  },
  add: (userId: string, transaction: LoyaltyTransaction) => {
    const all = getItem<Record<string, LoyaltyTransaction[]>>(KEYS.LOYALTY) ?? {};
    if (!all[userId]) all[userId] = [];
    all[userId].unshift(transaction);
    setItem(KEYS.LOYALTY, all);
  },
};

// =========================================
// STAFF
// =========================================
export const storageStaff = {
  get: (): StaffMember[] => getItem<StaffMember[]>(KEYS.STAFF) ?? [],
  set: (staff: StaffMember[]) => setItem(KEYS.STAFF, staff),
  add: (member: StaffMember) => {
    const staff = storageStaff.get();
    staff.push(member);
    storageStaff.set(staff);
  },
  remove: (id: string) => {
    const staff = storageStaff.get().filter(s => s.id !== id);
    storageStaff.set(staff);
  },
};

// =========================================
// SEEDED FLAG
// =========================================
export const storageSeeded = {
  isSeeded: (): boolean => getItem<boolean>(KEYS.SEEDED) ?? false,
  markSeeded: () => setItem(KEYS.SEEDED, true),
};
