'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Cart, CartItem, Product } from '@/lib/types';
import { storageCart } from '@/lib/storage';

interface CartContextValue {
  cart: Cart;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [], updatedAt: new Date().toISOString() });

  useEffect(() => {
    setCart(storageCart.get());
  }, []);

  function save(updated: Cart) {
    setCart(updated);
    storageCart.set(updated);
  }

  function addItem(product: Product, quantity = 1) {
    const existing = cart.items.findIndex(i => i.productId === product.id);
    let items = [...cart.items];
    if (existing >= 0) {
      items[existing] = {
        ...items[existing],
        quantity: items[existing].quantity + quantity,
      };
    } else {
      items = [...items, { productId: product.id, product, quantity }];
    }
    save({ items, updatedAt: new Date().toISOString() });
  }

  function removeItem(productId: string) {
    const items = cart.items.filter(i => i.productId !== productId);
    save({ items, updatedAt: new Date().toISOString() });
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    const items = cart.items.map(i =>
      i.productId === productId ? { ...i, quantity } : i
    );
    save({ items, updatedAt: new Date().toISOString() });
  }

  function clearCart() {
    const empty: Cart = { items: [], updatedAt: new Date().toISOString() };
    save(empty);
  }

  const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
