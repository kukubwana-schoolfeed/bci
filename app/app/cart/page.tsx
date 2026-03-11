'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ChevronRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';
import BCIPaymentModal from '@/components/BCIPaymentModal';

export default function CartPage() {
  const { cart, removeItem, updateQuantity, subtotal } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState(user?.addresses?.[0]?.street ?? '');
  const [showPayment, setShowPayment] = useState(false);

  const deliveryFee = subtotal >= 1000 && user?.loyaltyTier !== 'Bronze' ? 0 : 50;
  const total = subtotal + deliveryFee;
  const pointsAvailable = user?.loyaltyPoints ?? 0;

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6 text-center">
        <ShoppingBag size={48} className="text-[#333] mb-6" />
        <h1 className="font-headline text-3xl mb-3">Your cart is <em>empty</em></h1>
        <p className="font-body text-sm text-[#888] mb-8">Add some products to get started.</p>
        <Link href="/app/shop" className="btn-primary">
          BROWSE PRODUCTS <ChevronRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="px-4 pt-8 pb-4 border-b border-[rgba(201,168,76,0.15)]">
        <h1 className="font-headline text-3xl">Your <em>Cart</em></h1>
        <p className="font-body text-xs text-[#888] mt-1">{cart.items.length} item{cart.items.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Items */}
        {cart.items.map(item => (
          <motion.div
            key={item.productId}
            layout
            exit={{ opacity: 0, x: -20 }}
            className="card flex gap-3 p-3"
          >
            <Link href={`/app/shop/${item.productId}`} className="relative w-20 h-20 flex-shrink-0 bg-[#111]">
              <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
            </Link>
            <div className="flex-1 min-w-0">
              <h3 className="font-headline text-base leading-tight line-clamp-2">{item.product.name}</h3>
              <p className="font-headline text-lg text-[#C9A84C]">{formatPrice(item.product.price)}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center border border-[rgba(201,168,76,0.3)]">
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-[#888] hover:text-[#C9A84C]">
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center font-body text-sm font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-[#888] hover:text-[#C9A84C]">
                    <Plus size={12} />
                  </button>
                </div>
                <button onClick={() => removeItem(item.productId)} className="text-[#555] hover:text-[#EF4444] transition-colors p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Delivery Address */}
        <div className="card p-4">
          <label className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#555] block mb-2">
            Delivery Address
          </label>
          <input
            type="text"
            placeholder="Enter your delivery address in Lusaka"
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="input-gold"
          />
        </div>

        {/* Loyalty Points */}
        {user && pointsAvailable > 0 && (
          <div className="card p-4 border-[rgba(201,168,76,0.3)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#C9A84C] mb-1">
                  ROYALTY POINTS
                </p>
                <p className="font-body text-sm text-[#888]">You have {pointsAvailable.toLocaleString()} points available</p>
              </div>
              <div className="font-headline text-sm text-[#555]">Use at checkout</div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="card p-5">
          <h3 className="font-headline text-xl mb-4">Order Summary</h3>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between font-body text-sm text-[#888]">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between font-body text-sm text-[#888]">
              <span>Delivery fee</span>
              <span>{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</span>
            </div>
            <div className="h-px bg-[rgba(201,168,76,0.15)] my-2" />
            <div className="flex justify-between">
              <span className="font-body text-sm font-semibold">Total</span>
              <span className="font-headline text-2xl text-[#C9A84C]">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={() => setShowPayment(true)}
          disabled={!address}
          className="btn-primary w-full justify-center py-5 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ boxShadow: '0 0 30px rgba(201,168,76,0.3)' }}
        >
          PROCEED TO PAYMENT <ChevronRight size={16} />
        </button>
        {!address && (
          <p className="font-body text-xs text-center text-[#555]">Please enter a delivery address</p>
        )}
      </div>

      <BCIPaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        total={total}
        deliveryAddress={address}
        deliveryFee={deliveryFee}
      />
    </div>
  );
}
