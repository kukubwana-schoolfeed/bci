'use client';

const TICKER_ITEMS = [
  'FASHION · TECH · INNOVATION',
  'FREE DELIVERY IN LUSAKA',
  'SHOP NOW — PAY VIA AIRTEL MONEY · MTN MOMO · CARD',
  'LOYALTY POINTS ON EVERY PURCHASE',
  'SOCIETY BUSINESS PARK · LUSAKA · ZAMBIA',
  'BRAND NEW · SEALED · GENUINE · WARRANTY',
];

export default function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="ticker-wrap overflow-hidden bg-[#C9A84C] py-2.5">
      <div className="ticker-inner flex whitespace-nowrap animate-marquee">
        {items.map((item, idx) => (
          <span key={idx} className="ticker-item inline-flex items-center gap-4 px-8">
            <span className="font-body text-[11px] font-bold tracking-[0.25em] uppercase text-black">
              {item}
            </span>
            <span className="text-black/40 text-[8px]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
