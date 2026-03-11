'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Copy, Share2, ChevronRight, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { LOYALTY_TIERS } from '@/lib/seedData';
import { getTierColor, formatDate } from '@/lib/utils';
import { storageLoyalty } from '@/lib/storage';
import { LoyaltyTransaction } from '@/lib/types';
import Link from 'next/link';

export default function LoyaltyPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) setTransactions(storageLoyalty.get(user.id));
  }, [user]);

  function copyCode() {
    if (!user) return;
    navigator.clipboard?.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6 text-center">
        <Star size={48} className="text-[#C9A84C] mb-6" />
        <h1 className="font-headline text-3xl mb-3">Earn <em>Royalty Points</em></h1>
        <p className="font-body text-sm text-[#888] mb-8">Sign in to view your loyalty rewards.</p>
        <Link href="/app/account" className="btn-primary">SIGN IN</Link>
      </div>
    );
  }

  const tierIdx = LOYALTY_TIERS.findIndex(t => t.name === user.loyaltyTier);
  const currentTier = LOYALTY_TIERS[tierIdx];
  const nextTier = LOYALTY_TIERS[tierIdx + 1];
  const progress = nextTier
    ? ((user.loyaltyPoints - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="px-4 pt-8 pb-4 border-b border-[rgba(201,168,76,0.15)]">
        <h1 className="font-headline text-3xl">Royalty <em>Points</em></h1>
        <p className="font-body text-xs text-[#888] mt-1">Earn points on every purchase</p>
      </div>

      <div className="px-4 py-4 space-y-5">
        {/* Loyalty Card */}
        <div className="loyalty-card p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#C9A84C] opacity-5 blur-xl -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-body text-[9px] font-bold tracking-[0.3em] uppercase text-[#C9A84C] mb-1">
                BRIAN CHANDA INNOVATIONS
              </p>
              <p className="font-headline text-xl">{user.name}</p>
            </div>
            <div
              className="px-3 py-1.5 text-[9px] font-bold font-body tracking-[0.2em] uppercase"
              style={{ background: getTierColor(user.loyaltyTier), color: '#000' }}
            >
              {user.loyaltyTier}
            </div>
          </div>
          <p className="font-headline text-5xl text-[#C9A84C] mb-1">
            {user.loyaltyPoints.toLocaleString()}
          </p>
          <p className="font-body text-xs text-[#888]">ROYALTY POINTS</p>
        </div>

        {/* Progress to next tier */}
        {nextTier && (
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-body text-xs text-[#888]">Progress to <span style={{ color: getTierColor(nextTier.name) }}>{nextTier.name}</span></p>
              <p className="font-body text-xs text-[#C9A84C]">{nextTier.min - user.loyaltyPoints} pts needed</p>
            </div>
            <div className="h-2 bg-[#1C1C1C] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, progress)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: getTierColor(user.loyaltyTier) }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-body text-[9px] text-[#555]">{currentTier.name} ({currentTier.min})</span>
              <span className="font-body text-[9px] text-[#555]">{nextTier.name} ({nextTier.min})</span>
            </div>
          </div>
        )}

        {/* All Tiers */}
        <div>
          <h2 className="font-headline text-xl mb-3">Membership <em>Tiers</em></h2>
          <div className="space-y-2">
            {LOYALTY_TIERS.map(tier => {
              const isActive = tier.name === user.loyaltyTier;
              return (
                <div
                  key={tier.name}
                  className={`card p-4 ${isActive ? 'border-[rgba(201,168,76,0.5)]' : ''}`}
                  style={isActive ? { boxShadow: '0 0 20px rgba(201,168,76,0.1)' } : {}}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ background: tier.color }} />
                      <span className="font-body text-sm font-bold tracking-wider" style={{ color: tier.color }}>
                        {tier.name}
                      </span>
                      {isActive && (
                        <span className="font-body text-[8px] bg-[#C9A84C] text-black px-2 py-0.5 font-bold tracking-wider uppercase">
                          CURRENT
                        </span>
                      )}
                    </div>
                    <span className="font-body text-xs text-[#555]">{tier.min}+ pts</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {tier.perks.map((perk, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check size={10} style={{ color: tier.color }} />
                        <span className="font-body text-xs text-[#888]">{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Referral */}
        <div className="card p-5 border-[rgba(201,168,76,0.3)]">
          <h3 className="font-headline text-xl mb-2">Refer a <em>Friend</em></h3>
          <p className="font-body text-sm text-[#888] mb-4">Share your code and earn 100 Royalty Points for every friend who orders.</p>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 border border-[rgba(201,168,76,0.4)] bg-[#0A0A0A] px-4 py-3">
              <span className="font-body text-base font-bold tracking-[0.3em] text-[#C9A84C]">
                {user.referralCode}
              </span>
            </div>
            <button onClick={copyCode} className={`btn-primary px-4 py-3 text-[10px] ${copied ? 'bg-[#22C55E]' : ''}`}>
              {copied ? <><Check size={14} /></> : <><Copy size={14} /></>}
            </button>
          </div>
          <button className="btn-outline w-full justify-center text-[11px]">
            <Share2 size={14} /> SHARE
          </button>
        </div>

        {/* Points History */}
        {transactions.length > 0 && (
          <div>
            <h2 className="font-headline text-xl mb-3">Points <em>History</em></h2>
            <div className="space-y-2">
              {transactions.map(tx => (
                <div key={tx.id} className="card p-3 flex items-center justify-between">
                  <div>
                    <p className="font-body text-sm">{tx.description}</p>
                    <p className="font-body text-xs text-[#555]">{formatDate(tx.date)}</p>
                  </div>
                  <span className={`font-headline text-xl ${tx.type === 'earned' || tx.type === 'bonus' ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                    {tx.type === 'redeemed' ? '-' : '+'}{tx.points}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
