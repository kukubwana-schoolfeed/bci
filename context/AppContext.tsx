'use client';

import React, { useEffect } from 'react';
import { CartProvider } from './CartContext';
import { AuthProvider } from './AuthContext';
import { AdminProvider } from './AdminContext';
import {
  storageSeeded,
  storageProducts,
  storageUsers,
  storageOrders,
  storageMessages,
  storageStaff,
  storageFlashSales,
  storageBroadcasts,
} from '@/lib/storage';
import {
  PRODUCTS_SEED,
  USERS_SEED,
  ORDERS_SEED,
  MESSAGES_SEED,
  STAFF_SEED,
  FLASH_SALES_SEED,
  BROADCASTS_SEED,
} from '@/lib/seedData';

function Seeder({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (storageSeeded.isSeeded()) return;

    // Seed all data on first load
    storageProducts.set(PRODUCTS_SEED);
    storageUsers.set(USERS_SEED);
    storageOrders.set(ORDERS_SEED);
    storageMessages.set(MESSAGES_SEED);
    storageStaff.set(STAFF_SEED);
    storageFlashSales.set(FLASH_SALES_SEED);
    storageBroadcasts.set(BROADCASTS_SEED);

    storageSeeded.markSeeded();
  }, []);

  return <>{children}</>;
}

export function AppContext({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AuthProvider>
        <CartProvider>
          <Seeder>
            {children}
          </Seeder>
        </CartProvider>
      </AuthProvider>
    </AdminProvider>
  );
}
