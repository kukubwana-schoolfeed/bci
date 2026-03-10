'use client';

// =========================================
// CONFETTI HELPERS FOR BCI
// =========================================

let confetti: any = null;

async function loadConfetti() {
  if (!confetti) {
    const mod = await import('canvas-confetti');
    confetti = mod.default;
  }
  return confetti;
}

// Standard gold confetti — fires on any order
export async function fireGoldConfetti() {
  const fire = await loadConfetti();
  const gold = '#C9A84C';
  const goldLight = '#E2C675';
  const goldDark = '#A8872A';

  fire({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: [gold, goldLight, goldDark, '#fff'],
    scalar: 1.1,
  });

  setTimeout(() => {
    fire({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: [gold, goldLight, '#fff'],
    });
    fire({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: [gold, goldLight, '#fff'],
    });
  }, 150);
}

// Royalty confetti — fires on orders ≥ K500 — more dramatic
export async function fireRoyaltyConfetti() {
  const fire = await loadConfetti();
  const gold = '#C9A84C';
  const goldLight = '#E2C675';
  const goldDark = '#A8872A';

  // First burst — big centre explosion
  fire({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.5 },
    colors: [gold, goldLight, goldDark, '#fff', '#FFD700'],
    scalar: 1.3,
    gravity: 0.8,
    ticks: 200,
  });

  // Left + right side cannons
  setTimeout(() => {
    fire({
      particleCount: 60,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.6 },
      colors: [gold, goldLight, '#fff'],
      scalar: 1.2,
    });
    fire({
      particleCount: 60,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.6 },
      colors: [gold, goldLight, '#fff'],
      scalar: 1.2,
    });
  }, 200);

  // Finale burst
  setTimeout(() => {
    fire({
      particleCount: 100,
      spread: 120,
      origin: { y: 0.4 },
      colors: [gold, goldLight, goldDark, '#FFD700'],
      startVelocity: 35,
      ticks: 300,
    });
  }, 500);
}

// Stars burst — for loyalty milestones
export async function fireStarConfetti() {
  const fire = await loadConfetti();
  fire({
    particleCount: 50,
    spread: 80,
    origin: { y: 0.7 },
    shapes: ['star'],
    colors: ['#C9A84C', '#E2C675', '#FFD700'],
    scalar: 1.5,
  });
}
