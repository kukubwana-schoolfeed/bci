// Generate BCI order reference: BCI-XXXXXX
export function generateOrderId(): string {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `BCI-${digits}`;
}

// Generate a referral code: BCI + 6 alphanumeric chars
export function generateReferralCode(name: string): string {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${initials}${random}`;
}

// Format price in Zambian Kwacha
export function formatPrice(amount: number): string {
  return `K${amount.toLocaleString('en-ZM')}`;
}

// Format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-ZM', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Format time
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-ZM', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Format relative time (e.g., "2m ago")
export function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// Calculate loyalty points earned from order total
export function calculateLoyaltyPoints(total: number, tier: string): number {
  const rateMap: Record<string, number> = {
    Bronze: 1,
    Silver: 1.5,
    Gold: 2,
    Platinum: 3,
  };
  const rate = rateMap[tier] ?? 1;
  return Math.floor((total / 10) * rate);
}

// Get loyalty tier from points
export function getLoyaltyTier(points: number): 'Bronze' | 'Silver' | 'Gold' | 'Platinum' {
  if (points >= 2500) return 'Platinum';
  if (points >= 1000) return 'Gold';
  if (points >= 500) return 'Silver';
  return 'Bronze';
}

// Get tier color
export function getTierColor(tier: string): string {
  const colors: Record<string, string> = {
    Bronze: '#CD7F32',
    Silver: '#C0C0C0',
    Gold: '#C9A84C',
    Platinum: '#E5E4E2',
  };
  return colors[tier] ?? '#C9A84C';
}

// Generate a unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Truncate text
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '…';
}

// Clamp a number between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Format countdown timer (seconds → mm:ss or hh:mm:ss)
export function formatCountdown(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const pad = (n: number) => String(n).padStart(2, '0');

  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

// Calculate % off
export function percentOff(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100);
}

// Get estimated reach for broadcast target
export function getEstimatedReach(target: string, totalUsers: number): number {
  const ratios: Record<string, number> = {
    all: 1,
    gold_plus: 0.3,
    bronze: 0.4,
    custom: 0.6,
  };
  return Math.floor(totalUsers * (ratios[target] ?? 0.5));
}
