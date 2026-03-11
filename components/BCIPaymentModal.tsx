'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Loader2 } from 'lucide-react';
import { formatPrice, generateOrderId, generateId, calculateLoyaltyPoints } from '@/lib/utils';
import { storageOrders } from '@/lib/storage';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { PaymentMethod, Order } from '@/lib/types';
import { fireRoyaltyConfetti, fireGoldConfetti } from '@/lib/confetti';

interface BCIPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  deliveryAddress: string;
  deliveryFee: number;
}

type Step = 'select' | 'details' | 'processing' | 'success';

export default function BCIPaymentModal({
  isOpen, onClose, total, deliveryAddress, deliveryFee,
}: BCIPaymentModalProps) {
  const { user, addLoyaltyPoints } = useAuth();
  const { cart, clearCart } = useCart();
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [phone, setPhone] = useState('');
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [step, setStep] = useState<Step>('select');
  const [orderRef, setOrderRef] = useState('');
  const [pointsEarned, setPointsEarned] = useState(0);

  function handleSelectMethod(m: PaymentMethod) {
    setMethod(m);
    setStep('details');
  }

  function handlePay() {
    setStep('processing');
    setTimeout(() => {
      // Create order
      const ref = generateOrderId();
      const pts = calculateLoyaltyPoints(total, user?.loyaltyTier ?? 'Bronze');
      const order: Order = {
        id: generateId(),
        ref,
        userId: user?.id ?? 'guest',
        customerName: user?.name ?? 'Guest',
        customerPhone: user?.phone ?? phone,
        customerEmail: user?.email ?? '',
        items: cart.items.map(i => ({
          productId: i.productId,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.image,
        })),
        subtotal: total - deliveryFee,
        deliveryFee,
        total,
        loyaltyPointsEarned: pts,
        loyaltyPointsRedeemed: 0,
        paymentMethod: method!,
        deliveryAddress,
        status: 'received',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      storageOrders.add(order);
      if (user) addLoyaltyPoints(pts, `Order ${ref}`);
      clearCart();
      setOrderRef(ref);
      setPointsEarned(pts);
      setStep('success');

      // Fire confetti
      if (total >= 500) {
        fireRoyaltyConfetti();
      } else {
        fireGoldConfetti();
      }
    }, 2500);
  }

  function handleClose() {
    setStep('select');
    setMethod(null);
    setPhone('');
    setCardNum('');
    setExpiry('');
    setCvv('');
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={e => e.target === e.currentTarget && step !== 'processing' && handleClose()}
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="bg-[#111] border border-[rgba(201,168,76,0.2)] w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            {step !== 'success' && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(201,168,76,0.15)]">
                <div>
                  <p className="font-body text-[10px] font-bold tracking-[0.25em] uppercase text-[#C9A84C]">
                    SECURE PAYMENT
                  </p>
                  <p className="font-headline text-xl">Total: <em>{formatPrice(total)}</em></p>
                </div>
                {step !== 'processing' && (
                  <button onClick={handleClose} className="text-[#555] hover:text-[#888] transition-colors p-1">
                    <X size={20} />
                  </button>
                )}
              </div>
            )}

            <div className="px-6 py-6">
              {/* SELECT METHOD */}
              {step === 'select' && (
                <div>
                  <p className="font-body text-xs text-[#888] mb-6">Choose your payment method</p>
                  <div className="flex flex-col gap-3">
                    {/* Airtel Money */}
                    <button
                      onClick={() => handleSelectMethod('airtel')}
                      className="flex items-center gap-4 p-4 border border-[rgba(255,255,255,0.08)] hover:border-[#EF4444] hover:bg-[rgba(239,68,68,0.05)] transition-all text-left"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#EF4444] flex items-center justify-center flex-shrink-0">
                        <span className="font-body text-[9px] font-bold text-white tracking-wider uppercase">AIRTEL</span>
                      </div>
                      <div>
                        <p className="font-body text-sm font-semibold">Airtel Money</p>
                        <p className="font-body text-xs text-[#888]">Pay with your Airtel Money account</p>
                      </div>
                    </button>

                    {/* MTN MoMo */}
                    <button
                      onClick={() => handleSelectMethod('momo')}
                      className="flex items-center gap-4 p-4 border border-[rgba(255,255,255,0.08)] hover:border-[#F59E0B] hover:bg-[rgba(245,158,11,0.05)] transition-all text-left"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#F59E0B] flex items-center justify-center flex-shrink-0">
                        <span className="font-body text-[9px] font-bold text-black tracking-wider uppercase">MTN</span>
                      </div>
                      <div>
                        <p className="font-body text-sm font-semibold">MTN MoMo</p>
                        <p className="font-body text-xs text-[#888]">Pay with your MTN Mobile Money</p>
                      </div>
                    </button>

                    {/* Card */}
                    <button
                      onClick={() => handleSelectMethod('card')}
                      className="flex items-center gap-4 p-4 border border-[rgba(255,255,255,0.08)] hover:border-[#C9A84C] hover:bg-[rgba(201,168,76,0.05)] transition-all text-left"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#C9A84C] flex items-center justify-center flex-shrink-0">
                        <span className="font-body text-[9px] font-bold text-black tracking-wider uppercase">CARD</span>
                      </div>
                      <div>
                        <p className="font-body text-sm font-semibold">Card Payment</p>
                        <p className="font-body text-xs text-[#888]">Visa, Mastercard, AMEX</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* PAYMENT DETAILS */}
              {step === 'details' && (
                <div>
                  <button
                    onClick={() => setStep('select')}
                    className="font-body text-xs text-[#555] hover:text-[#888] mb-6 flex items-center gap-1"
                  >
                    ← Back
                  </button>
                  {(method === 'airtel' || method === 'momo') && (
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#555] block mb-2">
                          {method === 'airtel' ? 'Airtel' : 'MTN'} Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="+260 977 000 000"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          className="input-gold"
                        />
                      </div>
                      <p className="font-body text-xs text-[#888] bg-[#161616] p-3">
                        You will receive a payment prompt on your phone. Enter your PIN to confirm.
                      </p>
                    </div>
                  )}
                  {method === 'card' && (
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#555] block mb-2">Card Number</label>
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          value={cardNum}
                          maxLength={19}
                          onChange={e => setCardNum(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                          className="input-gold"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#555] block mb-2">Expiry</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={expiry}
                            maxLength={5}
                            onChange={e => setExpiry(e.target.value)}
                            className="input-gold"
                          />
                        </div>
                        <div>
                          <label className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#555] block mb-2">CVV</label>
                          <input
                            type="text"
                            placeholder="•••"
                            value={cvv}
                            maxLength={4}
                            onChange={e => setCvv(e.target.value)}
                            className="input-gold"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handlePay}
                    className="btn-primary w-full justify-center mt-6 py-5 text-base"
                    style={{ boxShadow: '0 0 30px rgba(201,168,76,0.4)' }}
                  >
                    PAY {formatPrice(total)} →
                  </button>
                </div>
              )}

              {/* PROCESSING */}
              {step === 'processing' && (
                <div className="text-center py-12">
                  <Loader2 size={48} className="text-[#C9A84C] mx-auto mb-6 animate-spin" />
                  <h2 className="font-headline text-2xl mb-2">Processing Payment</h2>
                  <p className="font-body text-sm text-[#888]">Please wait...</p>
                </div>
              )}

              {/* SUCCESS */}
              {step === 'success' && (
                <div className="text-center py-8">
                  {/* Gold animated checkmark */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-[#C9A84C] flex items-center justify-center"
                    style={{ boxShadow: '0 0 40px rgba(201,168,76,0.4)' }}
                  >
                    <Check size={36} className="text-[#C9A84C]" strokeWidth={2.5} />
                  </motion.div>

                  <h2 className="font-headline text-3xl mb-2">Order <em>Confirmed</em></h2>
                  <p className="font-body text-xs text-[#555] mb-4 tracking-[0.2em] uppercase">{orderRef}</p>

                  {/* Loyalty points */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)] p-4 mb-6 inline-block"
                  >
                    <p className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#888] mb-1">
                      ROYALTY POINTS EARNED
                    </p>
                    <p className="font-headline text-3xl text-[#C9A84C]">+{pointsEarned} pts</p>
                  </motion.div>

                  <p className="font-body text-sm text-[#888] mb-8">
                    Your order is being prepared by Brian Chanda Innovations.
                    Expected delivery within 24 hours.
                  </p>

                  <div className="flex flex-col gap-3">
                    <a
                      href="/app/orders"
                      onClick={handleClose}
                      className="btn-primary w-full justify-center py-4"
                    >
                      TRACK ORDER
                    </a>
                    <button
                      onClick={handleClose}
                      className="btn-ghost w-full justify-center"
                    >
                      CONTINUE SHOPPING
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
